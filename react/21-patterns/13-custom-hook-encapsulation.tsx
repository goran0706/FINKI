/**
 * Custom Hook Encapsulation
 * =========================
 *
 * Custom hooks encapsulate reusable stateful logic behind a focused function interface.
 * They allow components to share behavior without sharing a component hierarchy, while each
 * component keeps its own hook state and controls how the returned values are rendered.
 */

import { useCallback, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Encapsulating counter state
// ---------------------------------------------------------------------

interface CounterState {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export const useCounter = (initialValue = 0): CounterState => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback((): void => {
    setCount((currentCount) => currentCount + 1);
  }, []);

  const decrement = useCallback((): void => {
    setCount((currentCount) => currentCount - 1);
  }, []);

  const reset = useCallback((): void => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

// The hook owns the state transitions.
// The component using the hook decides how those values and actions should be rendered.

// ---------------------------------------------------------------------
// 2. Using the custom hook
// ---------------------------------------------------------------------

export const CounterExample: FC = (): ReactElement => {
  const { count, increment, decrement, reset } = useCounter();

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={decrement}>
        Decrement
      </button>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Encapsulating form state
// ---------------------------------------------------------------------

interface FormState {
  readonly name: string;
  readonly email: string;
}

interface FormActions {
  readonly setName: (name: string) => void;
  readonly setEmail: (email: string) => void;
  readonly reset: () => void;
}

interface UseFormResult {
  readonly values: FormState;
  readonly actions: FormActions;
}

export const useUserForm = (initialValues: FormState): UseFormResult => {
  const [values, setValues] = useState(initialValues);

  const setName = useCallback((name: string): void => {
    setValues((currentValues) => ({
      ...currentValues,
      name,
    }));
  }, []);

  const setEmail = useCallback((email: string): void => {
    setValues((currentValues) => ({
      ...currentValues,
      email,
    }));
  }, []);

  const reset = useCallback((): void => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    actions: {
      setName,
      setEmail,
      reset,
    },
  };
};

// ---------------------------------------------------------------------
// 4. Using the form hook
// ---------------------------------------------------------------------

export const UserFormExample: FC = (): ReactElement => {
  const { values, actions } = useUserForm({
    name: "",
    email: "",
  });

  return (
    <form>
      <label>
        Name
        <input value={values.name} onChange={(event) => actions.setName(event.target.value)} />
      </label>

      <label>
        Email
        <input type="email" value={values.email} onChange={(event) => actions.setEmail(event.target.value)} />
      </label>

      <button type="button" onClick={actions.reset}>
        Reset
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 5. Encapsulating toggle behavior
// ---------------------------------------------------------------------

interface ToggleState {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
}

export const useToggle = (initialValue = false): ToggleState => {
  const [isOpen, setIsOpen] = useState(initialValue);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((currentValue) => !currentValue);
  }, []);

  return { isOpen, open, close, toggle };
};

// ---------------------------------------------------------------------
// 6. Using the toggle hook
// ---------------------------------------------------------------------

export const ToggleExample: FC = (): ReactElement => {
  const { isOpen, toggle, close } = useToggle();

  return (
    <section>
      <button type="button" onClick={toggle}>
        {isOpen ? "Close" : "Open"}
      </button>

      {isOpen && (
        <div>
          <p>Additional content is visible.</p>
          <button type="button" onClick={close}>
            Close
          </button>
        </div>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 7. Multiple components can use the same hook
// ---------------------------------------------------------------------

export const IndependentCounters: FC = (): ReactElement => (
  <div>
    <CounterExample />
    <CounterExample />
  </div>
);

// Each `useCounter` call creates independent state.
// Sharing the hook implementation does not cause the components to share their state.

// ---------------------------------------------------------------------
// 8. Encapsulation boundary
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserState {
  readonly user: User;
  readonly updateEmail: (email: string) => void;
}

export const useUser = (initialUser: User): UserState => {
  const [user, setUser] = useState(initialUser);

  const updateEmail = useCallback((email: string): void => {
    setUser((currentUser) => ({
      ...currentUser,
      email,
    }));
  }, []);

  return { user, updateEmail };
};

export const UserProfileExample: FC = (): ReactElement => {
  const { user, updateEmail } = useUser({
    name: "John Doe",
    email: "john@example.com",
  });

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button type="button" onClick={() => updateEmail("updated@example.com")}>
        Update Email
      </button>
    </article>
  );
};

// The hook hides the state-management details.
// The component only depends on the returned interface.

// ---------------------------------------------------------------------
// 9. Complete custom hook example
// ---------------------------------------------------------------------

export const CustomHookEncapsulationDemo: FC = (): ReactElement => (
  <div>
    <CounterExample />
    <UserFormExample />
    <ToggleExample />
    <IndependentCounters />
    <UserProfileExample />
  </div>
);

// Custom hooks encapsulate behavior, not UI.
// A component remains responsible for deciding how the hook's returned state and actions are presented.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom hooks encapsulate reusable stateful logic behind a function interface.
// - A hook can own state, state transitions, derived values, and callbacks.
// - Components using the hook decide how its returned values are rendered.
// - Multiple components can use the same custom hook implementation while maintaining independent state.
// - Encapsulation hides implementation details while exposing the values and actions consumers need.
// - Custom hooks share behavior and logic, not component state.
// - Custom hooks do not replace components; they separate reusable behavior from UI rendering.
