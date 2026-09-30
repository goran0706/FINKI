/**
 * Mocking Functions
 * ==================
 *
 * Function mocks replace or control function behavior during a test and record how
 * those functions are used. They are useful for testing callbacks, injected dependencies,
 * event handlers, and other interactions without executing the real implementation.
 */

import { useState, type FC, type ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// ---------------------------------------------------------------------
// 1. Creating a mock function
// ---------------------------------------------------------------------

export const createMock = (): ReturnType<typeof vi.fn> => {
  return vi.fn();
};

// `vi.fn()` creates a mock function that can:
//
// - Record how many times it was called.
// - Record the arguments passed to it.
// - Return configured values.
// - Replace an implementation.
// - Be reset or cleared between tests.
//
// const callback = vi.fn();
//
// callback("example");
//
// expect(callback).toHaveBeenCalledTimes(1);
// expect(callback).toHaveBeenCalledWith("example");

// ---------------------------------------------------------------------
// 2. Testing a callback
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => void;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
};

// A callback can be replaced with a mock:
//
// const user = userEvent.setup();
// const onSave = vi.fn();
//
// render(<SaveButton onSave={onSave} />);
//
// await user.click(screen.getByRole("button", {name: "Save"}));
//
// expect(onSave).toHaveBeenCalledTimes(1);
//
// The test verifies that the user interaction invokes the callback.

// ---------------------------------------------------------------------
// 3. Inspecting mock arguments
// ---------------------------------------------------------------------

interface DeleteButtonProps {
  readonly itemId: string;
  readonly onDelete: (itemId: string) => void;
}

export const DeleteButton: FC<DeleteButtonProps> = ({ itemId, onDelete }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        onDelete(itemId);
      }}
    >
      Delete
    </button>
  );
};

// The mock records the argument:
//
// const user = userEvent.setup();
// const onDelete = vi.fn();
//
// render(
//     <DeleteButton
//         itemId="42"
//         onDelete={onDelete}
//     />,
// );
//
// await user.click(screen.getByRole("button", {name: "Delete"}));
//
// expect(onDelete).toHaveBeenCalledWith("42");

// ---------------------------------------------------------------------
// 4. Mock return values
// ---------------------------------------------------------------------

// `mockReturnValue` configures a synchronous return value:
//
// const getStatus = vi.fn();
//
// getStatus.mockReturnValue("ready");
//
// expect(getStatus()).toBe("ready");

// ---------------------------------------------------------------------
// 5. Mocking a return value once
// ---------------------------------------------------------------------

// `mockReturnValueOnce` controls one specific call:
//
// const getStatus = vi.fn();
//
// getStatus
//     .mockReturnValueOnce("loading")
//     .mockReturnValueOnce("ready");
//
// expect(getStatus()).toBe("loading");
// expect(getStatus()).toBe("ready");

// ---------------------------------------------------------------------
// 6. Mock implementations
// ---------------------------------------------------------------------

// `mockImplementation` replaces the function's behavior:
//
// const formatName = vi.fn();
//
// formatName.mockImplementation((name: string) => {
//     return name.toUpperCase();
// });
//
// expect(formatName("John Doe")).toBe("JOHN DOE");

// ---------------------------------------------------------------------
// 7. Mock implementations for individual calls
// ---------------------------------------------------------------------

// `mockImplementationOnce` configures one call:
//
// const getValue = vi.fn();
//
// getValue
//     .mockImplementationOnce(() => "first")
//     .mockImplementationOnce(() => "second");
//
// expect(getValue()).toBe("first");
// expect(getValue()).toBe("second");

// ---------------------------------------------------------------------
// 8. Mocking asynchronous functions
// ---------------------------------------------------------------------

// `mockResolvedValue` creates a Promise that resolves with the supplied value:
//
// const fetchUser = vi.fn();
//
// fetchUser.mockResolvedValue({
//     id: "42",
//     name: "John Doe",
// });
//
// const user = await fetchUser();
//
// expect(user.name).toBe("John Doe");

// ---------------------------------------------------------------------
// 9. Mocking rejected Promises
// ---------------------------------------------------------------------

// `mockRejectedValue` creates a Promise that rejects:
//
// const fetchUser = vi.fn();
//
// fetchUser.mockRejectedValue(
//     new Error("Request failed"),
// );
//
// await expect(fetchUser()).rejects.toThrow("Request failed");

// ---------------------------------------------------------------------
// 10. Mocking asynchronous calls once
// ---------------------------------------------------------------------

// `mockResolvedValueOnce` and `mockRejectedValueOnce` can model different
// outcomes across multiple asynchronous calls:
//
// const fetchUser = vi.fn();
//
// fetchUser
//     .mockResolvedValueOnce({id: "42", name: "John Doe"})
//     .mockRejectedValueOnce(new Error("Request failed"));
//
// The first call resolves and the second call rejects.

// ---------------------------------------------------------------------
// 11. Mocking an injected dependency
// ---------------------------------------------------------------------

interface UserService {
  readonly getName: (id: string) => Promise<string>;
}

interface UserGreetingProps {
  readonly userId: string;
  readonly userService: UserService;
}

export const UserGreeting: FC<UserGreetingProps> = ({ userId, userService }): ReactElement => {
  const [name, setName] = useState<string | null>(null);

  const handleLoad = async (): Promise<void> => {
    const userName = await userService.getName(userId);
    setName(userName);
  };

  return (
    <>
      <button type="button" onClick={() => void handleLoad()}>
        Load user
      </button>

      {name !== null && <p>Hello, {name}.</p>}
    </>
  );
};

// The dependency can be represented by a mock:
//
// const user = userEvent.setup();
// const getName = vi.fn();
//
// getName.mockResolvedValue("John Doe");
//
// render(
//     <UserGreeting
//         userId="42"
//         userService={{getName}}
//     />,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Load user"}),
// );
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// expect(getName).toHaveBeenCalledWith("42");

// ---------------------------------------------------------------------
// 12. Testing callback order
// ---------------------------------------------------------------------

interface WorkflowProps {
  readonly onStart: () => void;
  readonly onComplete: () => void;
}

export const Workflow: FC<WorkflowProps> = ({ onStart, onComplete }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        onStart();
        onComplete();
      }}
    >
      Run workflow
    </button>
  );
};

// Separate mocks can verify that both callbacks were invoked:
//
// const onStart = vi.fn();
// const onComplete = vi.fn();
//
// render(
//     <Workflow
//         onStart={onStart}
//         onComplete={onComplete}
//     />,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Run workflow"}),
// );
//
// expect(onStart).toHaveBeenCalledTimes(1);
// expect(onComplete).toHaveBeenCalledTimes(1);
//
// `invocationCallOrder` can be inspected when call ordering itself is part of
// the behavior:
//
// expect(onStart.mock.invocationCallOrder[0])
//     .toBeLessThan(onComplete.mock.invocationCallOrder[0]);

// ---------------------------------------------------------------------
// 13. Testing multiple calls
// ---------------------------------------------------------------------

// Mock call history contains every invocation:
//
// const callback = vi.fn();
//
// callback("first");
// callback("second");
//
// expect(callback).toHaveBeenCalledTimes(2);
// expect(callback).toHaveBeenNthCalledWith(1, "first");
// expect(callback).toHaveBeenNthCalledWith(2, "second");

// ---------------------------------------------------------------------
// 14. Testing the most recent call
// ---------------------------------------------------------------------

// `toHaveBeenLastCalledWith` verifies the arguments of the latest invocation:
//
// const callback = vi.fn();
//
// callback("first");
// callback("second");
//
// expect(callback).toHaveBeenLastCalledWith("second");

// ---------------------------------------------------------------------
// 15. Testing a function result
// ---------------------------------------------------------------------

// Mock results are available when the result itself is important:
//
// const calculate = vi.fn();
//
// calculate.mockReturnValue(42);
//
// calculate();
//
// expect(calculate).toHaveReturnedWith(42);
//
// `toHaveReturnedWith` is useful when verifying a mock's return value in addition
// to verifying that it was called.

// ---------------------------------------------------------------------
// 16. Mocking a function with TypeScript types
// ---------------------------------------------------------------------

interface Formatter {
  (value: number): string;
}

export const createFormatterMock = (): Formatter => {
  return vi.fn<Formatter>();
};

// A generic function type can be passed to `vi.fn` so the mock retains the
// expected parameter and return types.
//
// const formatter = createFormatterMock();
//
// formatter.mockReturnValue("$100");
//
// expect(formatter(100)).toBe("$100");

// ---------------------------------------------------------------------
// 17. Mocking a function passed as a prop
// ---------------------------------------------------------------------

interface FormProps {
  readonly onSubmit: (value: string) => void;
}

export const NameForm: FC<FormProps> = ({ onSubmit }): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <label>
        Name
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// The callback can be inspected after a complete user interaction:
//
// const user = userEvent.setup();
// const onSubmit = vi.fn();
//
// render(<NameForm onSubmit={onSubmit} />);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Name"}),
//     "John Doe",
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Submit"}),
// );
//
// expect(onSubmit).toHaveBeenCalledWith("John Doe");

// ---------------------------------------------------------------------
// 18. Mocking a callback without testing implementation details
// ---------------------------------------------------------------------

// A callback mock should normally verify meaningful interaction:
//
// expect(onSubmit).toHaveBeenCalledWith("John Doe");
//
// Avoid asserting incidental details such as the exact number of internal
// helper-function calls unless that call count is part of the component's
// observable contract.

// ---------------------------------------------------------------------
// 19. Clear mock history
// ---------------------------------------------------------------------

// `mockClear` removes recorded calls but keeps the current implementation:
//
// const callback = vi.fn(() => "ready");
//
// callback();
//
// callback.mockClear();
//
// expect(callback).not.toHaveBeenCalled();
// expect(callback()).toBe("ready");

// ---------------------------------------------------------------------
// 20. Reset mock implementation
// ---------------------------------------------------------------------

// `mockReset` removes call history and resets the mock implementation:
//
// const callback = vi.fn(() => "ready");
//
// callback.mockReset();
//
// expect(callback()).toBeUndefined();
// expect(callback).not.toHaveBeenCalled();

// ---------------------------------------------------------------------
// 21. Restore spies
// ---------------------------------------------------------------------

// `mockRestore` is intended for spies and restores the original implementation:
//
// const spy = vi.spyOn(object, "method");
//
// spy.mockImplementation(() => "mocked");
// expect(object.method()).toBe("mocked");
//
// spy.mockRestore();
// expect(object.method()).toBe("original");
//
// A standalone `vi.fn()` has no original implementation to restore.

// ---------------------------------------------------------------------
// 22. Resetting mocks between tests
// ---------------------------------------------------------------------

// Test suites should prevent call history from leaking:
//
// beforeEach(() => {
//     vi.clearAllMocks();
// });
//
// This keeps each test independent while preserving mock implementations.
//
// If implementations also need to be reset, use:
//
// beforeEach(() => {
//     vi.resetAllMocks();
// });
//
// Restore spies when the original implementations must be reinstated:
//
// afterEach(() => {
//     vi.restoreAllMocks();
// });

// ---------------------------------------------------------------------
// 23. Mocking errors from dependencies
// ---------------------------------------------------------------------

interface SaveService {
  readonly save: (value: string) => Promise<void>;
}

interface SaveFormProps {
  readonly service: SaveService;
}

export const SaveForm: FC<SaveFormProps> = ({ service }): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (): Promise<void> => {
    setError(null);

    try {
      await service.save("example");
    } catch {
      setError("Could not save.");
    }
  };

  return (
    <>
      <button type="button" onClick={() => void handleSave()}>
        Save
      </button>

      {error !== null && <p role="alert">{error}</p>}
    </>
  );
};

// A rejected mock can exercise the error path:
//
// const user = userEvent.setup();
// const save = vi.fn().mockRejectedValue(
//     new Error("Request failed"),
// );
//
// render(<SaveForm service={{save}} />);
//
// await user.click(
//     screen.getByRole("button", {name: "Save"}),
// );
//
// expect(
//     await screen.findByRole("alert"),
// ).toHaveTextContent("Could not save.");
//
// expect(save).toHaveBeenCalledWith("example");

// ---------------------------------------------------------------------
// 24. Mocking a callback with different results
// ---------------------------------------------------------------------

// Success and failure behavior can be modeled across calls:
//
// const save = vi.fn()
//     .mockResolvedValueOnce(undefined)
//     .mockRejectedValueOnce(new Error("Request failed"));
//
// await save("first");
// await expect(save("second")).rejects.toThrow("Request failed");
//
// This is useful when the tested code has different behavior depending on
// successive dependency results.

// ---------------------------------------------------------------------
// 25. Mocking function identity
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly action: () => void;
}

export const ActionButton: FC<ActionButtonProps> = ({ action }): ReactElement => {
  return (
    <button type="button" onClick={action}>
      Run action
    </button>
  );
};

// A mock can also verify that the exact callback was invoked:
//
// const action = vi.fn();
//
// render(<ActionButton action={action} />);
//
// await user.click(
//     screen.getByRole("button", {name: "Run action"}),
// );
//
// expect(action).toHaveBeenCalledTimes(1);

// ---------------------------------------------------------------------
// 26. Function mocks versus spies
// ---------------------------------------------------------------------

// A standalone mock:
//
// const callback = vi.fn();
//
// starts with no real implementation.
//
// A spy:
//
// const spy = vi.spyOn(service, "save");
//
// wraps an existing object method and can be restored.
//
// Use a standalone mock for injected callbacks and a spy when the relationship
// with an existing object's method matters.

// ---------------------------------------------------------------------
// 27. Mocking versus replacing application logic
// ---------------------------------------------------------------------

// A mock should represent a dependency boundary:
//
// const service = {
//     save: vi.fn(),
// };
//
// render(<SaveForm service={service} />);
//
//
// It should not replace the behavior that the test is supposed to verify.
// If the test mocks the component's own logic, the test can become disconnected
// from the actual implementation.

// ---------------------------------------------------------------------
// 28. Avoiding shared mutable mocks
// ---------------------------------------------------------------------

// Prefer creating test-specific mocks:
//
// it("saves a value", async () => {
//     const save = vi.fn().mockResolvedValue(undefined);
//
//     // Test...
// });
//
// This keeps configuration local and makes the test's dependency behavior
// immediately visible.

// ---------------------------------------------------------------------
// 29. Complete callback-testing pattern
// ---------------------------------------------------------------------

// A typical callback test follows this sequence:
//
// const user = userEvent.setup();
// const onSubmit = vi.fn();
//
// render(<NameForm onSubmit={onSubmit} />);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Name"}),
//     "John Doe",
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Submit"}),
// );
//
// expect(onSubmit).toHaveBeenCalledTimes(1);
// expect(onSubmit).toHaveBeenCalledWith("John Doe");
//
// The test verifies the user action and the callback contract without testing
// React's event-dispatching implementation.

// ---------------------------------------------------------------------
// 30. Complete dependency-mocking pattern
// ---------------------------------------------------------------------

// For an injected dependency:
//
// const getName = vi.fn().mockResolvedValue("John Doe");
//
// render(
//     <UserGreeting
//         userId="42"
//         userService={{getName}}
//     />,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Load user"}),
// );
//
// expect(
//     await screen.findByText("Hello, John Doe."),
// ).toBeInTheDocument();
//
// expect(getName).toHaveBeenCalledWith("42");
//
// The mock controls the dependency while the test verifies the component's
// observable behavior and meaningful interaction with that dependency.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `vi.fn()` creates a mock function that records calls and can be configured.
// - `mockReturnValue` and `mockReturnValueOnce` control synchronous results.
// - `mockImplementation` and `mockImplementationOnce` replace function behavior.
// - `mockResolvedValue` and `mockRejectedValue` control asynchronous results.
// - Mock arguments can be verified with call-specific assertions.
// - Callback mocks are useful for testing component-to-parent interactions.
// - Injected dependencies can be represented with typed mock functions.
// - `mockClear` removes call history without changing the implementation.
// - `mockReset` removes call history and resets the mock implementation.
// - `mockRestore` restores the original implementation of a spy.
// - Create test-specific mocks when possible to avoid shared mutable state.
// - Mock dependencies at meaningful boundaries rather than replacing the behavior under test.
// - Prefer observable behavior and meaningful interactions over implementation-detail assertions.
