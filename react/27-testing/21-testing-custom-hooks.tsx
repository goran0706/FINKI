/**
 * Testing Custom Hooks
 * =====================
 *
 * Custom hooks contain reusable stateful logic that is shared between components.
 * Tests should verify the hook's observable behavior, including its returned values,
 * state transitions, and effects, without coupling the test to the hook's internals.
 */

import { type FC, type ReactElement, type ReactNode, useEffect, useState } from "react";
import { renderHook, act } from "@testing-library/react";

// ---------------------------------------------------------------------
// 1. Basic custom hook
// ---------------------------------------------------------------------

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = (): void => {
    setCount((current) => current + 1);
  };

  const decrement = (): void => {
    setCount((current) => current - 1);
  };

  const reset = (): void => {
    setCount(initialValue);
  };

  return { count, increment, decrement, reset };
};

// `renderHook` renders a test component internally and exposes the hook result:
//
// const {result} = renderHook(() => useCounter());
//
// result.current.count
//
// The value returned by the hook is available through `result.current`.

// ---------------------------------------------------------------------
// 2. Testing returned state
// ---------------------------------------------------------------------

// A test can inspect the initial value:
//
// const {result} = renderHook(() => useCounter(10));
//
// expect(result.current.count).toBe(10);
//
// `renderHook` executes the hook within a valid React rendering environment.
// The test does not need to create a component solely to call the hook.

// ---------------------------------------------------------------------
// 3. Testing state updates
// ---------------------------------------------------------------------

// State-changing functions should be called inside `act`:
//
// const {result} = renderHook(() => useCounter(0));
//
// act(() => {
//     result.current.increment();
// });
//
// expect(result.current.count).toBe(1);
//
// `act` tells React that the operation is expected to cause a state update.
// Testing Library's `renderHook` does not mean arbitrary external state updates
// can be performed without an appropriate React update boundary.

// ---------------------------------------------------------------------
// 4. Testing multiple transitions
// ---------------------------------------------------------------------

// Hook behavior can be tested through a sequence of public operations:
//
// const {result} = renderHook(() => useCounter(5));
//
// act(() => {
//     result.current.increment();
//     result.current.increment();
// });
//
// expect(result.current.count).toBe(7);
//
// act(() => {
//     result.current.decrement();
// });
//
// expect(result.current.count).toBe(6);
//
// The test interacts with the hook through the values and functions it returns.

// ---------------------------------------------------------------------
// 5. Testing reset behavior
// ---------------------------------------------------------------------

// The reset operation should restore the initial value:
//
// const {result} = renderHook(() => useCounter(10));
//
// act(() => {
//     result.current.increment();
// });
//
// expect(result.current.count).toBe(11);
//
// act(() => {
//     result.current.reset();
// });
//
// expect(result.current.count).toBe(10);

// ---------------------------------------------------------------------
// 6. Hooks with dependencies
// ---------------------------------------------------------------------

interface UseGreetingOptions {
  readonly name: string;
}

export const useGreeting = ({ name }: UseGreetingOptions): string => {
  return `Hello, ${name}`;
};

// A hook that receives props can be rendered with:
//
// const {result} = renderHook(({name}) => useGreeting({name}), {
//     initialProps: {name: "John Doe"},
// });
//
// expect(result.current).toBe("Hello, John Doe");

// ---------------------------------------------------------------------
// 7. Rerendering a hook
// ---------------------------------------------------------------------

// `rerender` supplies new props to the hook:
//
// const {result, rerender} = renderHook(
//     ({name}) => useGreeting({name}),
//     {initialProps: {name: "John Doe"}},
// );
//
// expect(result.current).toBe("Hello, John Doe");
//
// rerender({name: "Jane Doe"});
//
// expect(result.current).toBe("Hello, Jane Doe");
//
// This tests how the hook responds when its inputs change.

// ---------------------------------------------------------------------
// 8. Testing effect-based hooks
// ---------------------------------------------------------------------

interface UseDocumentTitleOptions {
  readonly title: string;
}

export const useDocumentTitle = ({ title }: UseDocumentTitleOptions): void => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

// The hook can be tested by observing the browser-side effect:
//
// const {rerender} = renderHook(
//     ({title}) => useDocumentTitle({title}),
//     {initialProps: {title: "Home"}},
// );
//
// expect(document.title).toBe("Home");
//
// rerender({title: "Profile"});
//
// expect(document.title).toBe("Profile");

// ---------------------------------------------------------------------
// 9. Testing cleanup
// ---------------------------------------------------------------------

interface Subscription {
  subscribe(listener: () => void): () => void;
}

export const useSubscription = (subscription: Subscription): boolean => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const unsubscribe = subscription.subscribe(() => {
      setActive(true);
    });

    return unsubscribe;
  }, [subscription]);

  return active;
};

// `renderHook` returns `unmount`, which can be used to test cleanup:
//
// const unsubscribe = vi.fn();
// const subscription = {
//     subscribe: () => unsubscribe,
// };
//
// const {unmount} = renderHook(() => useSubscription(subscription));
//
// unmount();
//
// expect(unsubscribe).toHaveBeenCalledTimes(1);
//
// The cleanup function returned from `useEffect` runs when the hook is unmounted.

// ---------------------------------------------------------------------
// 10. Testing asynchronous hooks
// ---------------------------------------------------------------------

interface UseUserResult {
  readonly name: string | null;
  readonly loading: boolean;
}

export const useUser = (loadUser: () => Promise<{ name: string }>): UseUserResult => {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void loadUser().then((user) => {
      if (active) {
        setName(user.name);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [loadUser]);

  return { name, loading };
};

// An asynchronous test can wait for the hook to reach its expected state:
//
// const loadUser = async () => ({name: "John Doe"});
//
// const {result} = renderHook(() => useUser(loadUser));
//
// expect(result.current.loading).toBe(true);
//
// await waitFor(() => {
//     expect(result.current.loading).toBe(false);
// });
//
// expect(result.current.name).toBe("John Doe");
//
// `waitFor` observes the hook result until the asynchronous state transition
// has completed.

// ---------------------------------------------------------------------
// 11. Testing asynchronous actions
// ---------------------------------------------------------------------

interface UseSaveResult {
  readonly saving: boolean;
  readonly save: () => Promise<void>;
}

export const useSave = (saveRequest: () => Promise<void>): UseSaveResult => {
  const [saving, setSaving] = useState(false);

  const save = async (): Promise<void> => {
    setSaving(true);

    try {
      await saveRequest();
    } finally {
      setSaving(false);
    }
  };

  return { saving, save };
};

// The asynchronous action can be tested through the returned API:
//
// const saveRequest = vi.fn().mockResolvedValue(undefined);
//
// const {result} = renderHook(() => useSave(saveRequest));
//
// await act(async () => {
//     const promise = result.current.save();
//
//     expect(result.current.saving).toBe(true);
//
//     await promise;
// });
//
// expect(result.current.saving).toBe(false);
// expect(saveRequest).toHaveBeenCalledTimes(1);
//
// The test verifies the observable state transition around the asynchronous action.

// ---------------------------------------------------------------------
// 12. Testing context-dependent hooks
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "light",
});

export const useTheme = (): ThemeContextValue => {
  return React.useContext(ThemeContext);
};

// A hook that consumes context can be tested with a wrapper:
//
// const wrapper = ({children}: {children: ReactNode}): ReactElement => (
//     <ThemeContext.Provider value={{theme: "dark"}}>
//         {children}
//     </ThemeContext.Provider>
// );
//
// const {result} = renderHook(() => useTheme(), {wrapper});
//
// expect(result.current.theme).toBe("dark");
//
// The wrapper provides the context that the hook expects in a real component tree.

// ---------------------------------------------------------------------
// 13. Testing a hook with a wrapper
// ---------------------------------------------------------------------

interface QueryClientProviderProps {
  readonly children: ReactNode;
}

const ExampleProvider: FC<QueryClientProviderProps> = ({ children }): ReactElement => {
  return <div data-testid="provider">{children}</div>;
};

// A wrapper is useful when a hook requires providers, context, routing,
// or another surrounding React environment:
//
// const wrapper = ({children}: QueryClientProviderProps): ReactElement => (
//     <ExampleProvider>{children}</ExampleProvider>
// );
//
// const {result} = renderHook(() => useCustomHook(), {wrapper});
//
// The wrapper should provide only the environment required by the hook.

// ---------------------------------------------------------------------
// 14. Testing hook inputs
// ---------------------------------------------------------------------

interface UsePageSizeResult {
  readonly size: number;
  readonly next: () => void;
}

export const usePageSize = (initialSize: number): UsePageSizeResult => {
  const [size, setSize] = useState(initialSize);

  const next = (): void => {
    setSize((current) => current + 10);
  };

  return { size, next };
};

// Inputs can be tested independently from the hook's implementation:
//
// const {result, rerender} = renderHook(
//     ({size}) => usePageSize(size),
//     {initialProps: {size: 20}},
// );
//
// expect(result.current.size).toBe(20);
//
// rerender({size: 50});
//
// expect(result.current.size).toBe(20);
//
// `useState` preserves the existing state when the component remains mounted.
// Changing the hook's input does not automatically reset its local state.

// ---------------------------------------------------------------------
// 15. Testing hook contracts
// ---------------------------------------------------------------------

// A useful custom-hook test focuses on its public contract:
//
// const {result} = renderHook(() => useCounter(0));
//
// expect(result.current.count).toBe(0);
//
// act(() => {
//     result.current.increment();
// });
//
// expect(result.current.count).toBe(1);
//
// The test should not depend on whether the hook uses `useState`, `useReducer`,
// memoization, or another internal implementation unless that implementation
// itself is the behavior being tested.

// ---------------------------------------------------------------------
// 16. Hook tests versus component tests
// ---------------------------------------------------------------------

// `renderHook` is useful when the hook's behavior is the primary subject:
//
// const {result} = renderHook(() => useCounter());
//
// A component test is often more appropriate when the hook is only an
// implementation detail of user-facing behavior:
//
// render(<Counter />);
//
// await user.click(screen.getByRole("button", {name: "Count: 0"}));
//
// expect(screen.getByRole("button", {name: "Count: 1"})).toBeInTheDocument();
//
// Prefer testing through the component when the hook's behavior is already
// fully covered by observable UI behavior.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `renderHook` provides a React environment for testing custom hooks directly.
// - `result.current` exposes the hook's current return value.
// - Use `act` when directly triggering hook state updates.
// - Use `rerender` to test how a hook responds to changed inputs.
// - Use `unmount` to test effect cleanup.
// - Use `waitFor` or other asynchronous utilities for asynchronous hook state.
// - Use a wrapper when the hook requires context or another provider.
// - Test the hook's public contract rather than its internal implementation.
// - Prefer component tests when the hook's behavior is already observable through the UI.
