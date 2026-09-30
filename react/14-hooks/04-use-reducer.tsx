/**
 * useReducer
 * ==========
 *
 * `useReducer` manages state transitions through a reducer function. The
 * reducer receives the current state and an action, then returns the next
 * state. Calling the dispatch function sends an action to React, which
 * schedules a render and applies the reducer to the current state.
 *
 * The reducer must be a pure function: the same state and action should
 * produce the same result without mutating existing state or causing side
 * effects. Side effects such as network requests, timers, and DOM operations
 * belong outside the reducer.
 *
 * Actions are application-defined values that describe what happened rather
 * than instructions for mutating state. A discriminated union gives TypeScript
 * precise action narrowing, allowing each reducer branch to access only the
 * fields belonging to that action.
 *
 * React preserves reducer state between renders in the same way it preserves
 * state created with `useState`. The reducer function itself should not be
 * recreated with behavior that depends on changing external values.
 *
 * Returning the existing state object is valid when an action produces no
 * state change. Returning a newly created object is necessary when state has
 * changed. Mutating the existing object and returning it can prevent React
 * from observing the intended update.
 */

import { type ChangeEvent, type Dispatch, type FC, type ReactNode, useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterState {
  readonly count: number;
}

export type CounterAction =
  | {
      readonly type: "increment";
    }
  | {
      readonly type: "decrement";
    }
  | {
      readonly type: "reset";
      readonly value: number;
    };

export interface CounterReducerProps {
  readonly initialCount: number;
}

export interface Todo {
  readonly id: number;
  readonly text: string;
  readonly completed: boolean;
}

export interface TodoState {
  readonly todos: readonly Todo[];
}

export type TodoAction =
  | {
      readonly type: "add";
      readonly text: string;
    }
  | {
      readonly type: "toggle";
      readonly id: number;
    }
  | {
      readonly type: "remove";
      readonly id: number;
    };

export interface TodoReducerProps {
  readonly initialTodos: readonly Todo[];
}

export interface FormState {
  readonly name: string;
  readonly email: string;
}

export type FormAction =
  | {
      readonly type: "setName";
      readonly value: string;
    }
  | {
      readonly type: "setEmail";
      readonly value: string;
    }
  | {
      readonly type: "reset";
    };

export interface FormReducerProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface NoOpReducerProps {
  readonly initialValue: string;
}

export interface InvalidReducerPatternProps {
  readonly example: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Implements a reducer for a numeric counter. Each action describes a state
 * transition, while the reducer remains responsible for calculating the next
 * state without performing side effects.
 */
export const CounterReducerExample: FC<CounterReducerProps> = ({ initialCount }: CounterReducerProps): ReactNode => {
  const reducer = (state: CounterState, action: CounterAction): CounterState => {
    switch (action.type) {
      case "increment":
        return {
          count: state.count + 1,
        };

      case "decrement":
        return {
          count: state.count - 1,
        };

      case "reset":
        return {
          count: action.value,
        };

      default:
        return state;
    }
  };

  const [state, dispatch]: [CounterState, Dispatch<CounterAction>] = useReducer(reducer, {
    count: initialCount,
  });

  const increment = (): void => {
    dispatch({ type: "increment" });
  };

  const decrement = (): void => {
    dispatch({ type: "decrement" });
  };

  const reset = (): void => {
    dispatch({
      type: "reset",
      value: initialCount,
    });
  };

  return (
    <section>
      <h3>Reducer-driven counter</h3>
      <p>Count: {state.count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={decrement}>
        Decrement
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
};

/**
 * Implements a reducer for a collection of todos. Each action contains the
 * minimum information required for the reducer to calculate the next
 * immutable collection.
 */
export const TodoReducerExample: FC<TodoReducerProps> = ({ initialTodos }: TodoReducerProps): ReactNode => {
  const reducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
      case "add":
        return {
          todos: [
            ...state.todos,
            {
              id: Date.now(),
              text: action.text,
              completed: false,
            },
          ],
        };

      case "toggle":
        return {
          todos: state.todos.map(
            (todo: Todo): Todo =>
              todo.id === action.id
                ? {
                    ...todo,
                    completed: !todo.completed,
                  }
                : todo,
          ),
        };

      case "remove":
        return {
          todos: state.todos.filter((todo: Todo): boolean => todo.id !== action.id),
        };

      default:
        return state;
    }
  };

  const [state, dispatch]: [TodoState, Dispatch<TodoAction>] = useReducer(reducer, {
    todos: initialTodos,
  });

  const addTodo = (): void => {
    dispatch({
      type: "add",
      text: "New todo",
    });
  };

  const toggleFirstTodo = (): void => {
    const firstTodo: Todo | undefined = state.todos[0];

    if (firstTodo !== undefined) {
      dispatch({
        type: "toggle",
        id: firstTodo.id,
      });
    }
  };

  const removeFirstTodo = (): void => {
    const firstTodo: Todo | undefined = state.todos[0];

    if (firstTodo !== undefined) {
      dispatch({
        type: "remove",
        id: firstTodo.id,
      });
    }
  };

  return (
    <section>
      <h3>Reducer with collection state</h3>

      {state.todos.length > 0 ? (
        <ul>
          {state.todos.map(
            (todo: Todo): ReactNode => (
              <li key={todo.id}>
                {todo.text} — {todo.completed ? "completed" : "open"}
              </li>
            ),
          )}
        </ul>
      ) : (
        <p>No todos.</p>
      )}

      <button type="button" onClick={addTodo}>
        Add todo
      </button>
      <button type="button" onClick={toggleFirstTodo}>
        Toggle first todo
      </button>
      <button type="button" onClick={removeFirstTodo}>
        Remove first todo
      </button>
    </section>
  );
};

/**
 * Demonstrates using a reducer to keep related form fields under one state
 * transition model. Each action updates one field while preserving the
 * remaining fields through object spreading.
 */
export const FormReducerExample: FC<FormReducerProps> = ({
  initialName,
  initialEmail,
}: FormReducerProps): ReactNode => {
  const initialState: FormState = {
    name: initialName,
    email: initialEmail,
  };

  const reducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
      case "setName":
        return {
          ...state,
          name: action.value,
        };

      case "setEmail":
        return {
          ...state,
          email: action.value,
        };

      case "reset":
        return initialState;

      default:
        return state;
    }
  };

  const [state, dispatch]: [FormState, Dispatch<FormAction>] = useReducer(reducer, initialState);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: "setName",
      value: event.target.value,
    });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: "setEmail",
      value: event.target.value,
    });
  };

  const reset = (): void => {
    dispatch({ type: "reset" });
  };

  return (
    <section>
      <h3>Reducer-managed form state</h3>

      <label>
        Name
        <input value={state.name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input value={state.email} onChange={handleEmailChange} />
      </label>

      <button type="button" onClick={reset}>
        Reset form
      </button>

      <p>
        {state.name} — {state.email}
      </p>
    </section>
  );
};

/**
 * Demonstrates a reducer action that does not change state. Returning the
 * existing state object is appropriate when the requested transition is a
 * no-op.
 */
export const NoOpReducerExample: FC<NoOpReducerProps> = ({ initialValue }: NoOpReducerProps): ReactNode => {
  const reducer = (state: string, action: "keep" | "change"): string => {
    if (action === "keep") {
      return state;
    }

    return state === "active" ? "inactive" : "active";
  };

  const [value, dispatch]: [string, Dispatch<"keep" | "change">] = useReducer(reducer, initialValue);

  const keepValue = (): void => {
    dispatch("keep");
  };

  const changeValue = (): void => {
    dispatch("change");
  };

  return (
    <section>
      <h3>No-op reducer transition</h3>
      <p>Value: {value}</p>
      <button type="button" onClick={keepValue}>
        Keep value
      </button>
      <button type="button" onClick={changeValue}>
        Change value
      </button>
    </section>
  );
};

/**
 * Shows an invalid reducer pattern as text. Reducers must not perform side
 * effects such as requests, timers, logging-dependent behavior, or direct DOM
 * manipulation.
 */
export const ReducerPurityExample: FC<InvalidReducerPatternProps> = ({
  example,
}: InvalidReducerPatternProps): ReactNode => {
  return (
    <section>
      <h3>Reducer purity</h3>
      <pre>{example}</pre>
      <p>Reducers should calculate state from their inputs without side effects.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseReducerContainer: FC = (): ReactNode => {
  // Avoid side effects inside a reducer.
  const reducer = (state, action) => {
    fetch("/api/example");
    return {}; // nextState
  };

  return (
    <main>
      <h1>useReducer</h1>

      <h2>1. Modeling state transitions with actions</h2>
      <CounterReducerExample initialCount={0} />

      <h2>2. Managing collection state with a reducer</h2>
      <TodoReducerExample
        initialTodos={[
          {
            id: 1,
            text: "Learn reducers",
            completed: false,
          },
          {
            id: 2,
            text: "Write an example",
            completed: true,
          },
        ]}
      />

      <h2>3. Managing related form fields</h2>
      <FormReducerExample initialName="John Doe" initialEmail="john@example.com" />

      <h2>4. Returning the existing state for a no-op</h2>
      <NoOpReducerExample initialValue="active" />

      <h2>5. Keeping reducers pure</h2>
      <ReducerPurityExample example={invalidReducerExample} />
    </main>
  );
};

export default UseReducerContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useReducer` models state changes as actions processed by a reducer.
// - Reducers receive the current state and an action and return the next state.
// - Discriminated-union actions provide precise TypeScript narrowing.
// - Reducers should be pure and must not perform side effects.
// - Immutable updates create new objects or arrays when state changes.
// - Returning the existing state is appropriate for a genuine no-op transition.
// - `dispatch` sends actions to React and does not directly mutate state.
// - `useReducer` is useful when related state transitions are easier to model as actions.
