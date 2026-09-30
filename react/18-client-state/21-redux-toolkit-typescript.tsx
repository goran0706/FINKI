/**
 * Redux Toolkit with TypeScript
 * =============================
 *
 * Redux Toolkit provides strong TypeScript support for defining Redux state, actions, reducers,
 * stores, and React-Redux hooks. TypeScript can infer much of the Redux type information directly
 * from createSlice and configureStore, while explicit application types can describe state and
 * payloads where they improve clarity.
 *
 * A slice's reducer functions receive an Immer draft of the slice state, allowing mutation-style
 * syntax while Redux Toolkit produces immutable updates internally. PayloadAction<T> explicitly
 * describes the type of data carried by an action, and the store can expose RootState and
 * AppDispatch types through TypeScript inference.
 *
 * React-Redux hooks can also be typed so that selectors know the complete Redux state shape and
 * dispatch accepts only valid actions. This keeps component code type-safe without manually
 * describing every action object at each dispatch site.
 */

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterState {
  readonly value: number;
}

export interface MessageState {
  readonly text: string;
}

export interface UserState {
  readonly name: string;
  readonly active: boolean;
}

export interface ReduxToolkitTypeScriptExampleProps {
  readonly title: string;
}

export interface SetCountPayload {
  readonly amount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  } satisfies CounterState,
  reducers: {
    increment(state): void {
      state.value += 1;
    },
    incrementByAmount(state, action: PayloadAction<number>): void {
      state.value += action.payload;
    },
    setCount(state, action: PayloadAction<SetCountPayload>): void {
      state.value = action.payload.amount;
    },
  },
});

const messageSlice = createSlice({
  name: "message",
  initialState: {
    text: "Ready",
  } satisfies MessageState,
  reducers: {
    setMessage(state, action: PayloadAction<string>): void {
      state.text = action.payload;
    },
  },
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "John Doe",
    active: true,
  } satisfies UserState,
  reducers: {
    setActive(state, action: PayloadAction<boolean>): void {
      state.active = action.payload;
    },
  },
});

export const reduxToolkitTypeScriptStore = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    message: messageSlice.reducer,
    user: userSlice.reducer,
  },
});

export type ReduxToolkitRootState = ReturnType<typeof reduxToolkitTypeScriptStore.getState>;

export type ReduxToolkitAppDispatch = typeof reduxToolkitTypeScriptStore.dispatch;

export const useReduxToolkitSelector = <Selected,>(selector: (state: ReduxToolkitRootState) => Selected): Selected =>
  useSelector(selector);

export const useReduxToolkitDispatch = (): ReduxToolkitAppDispatch => useDispatch<ReduxToolkitAppDispatch>();

export const TypedStateExample: FC = (): ReactElement => {
  const count: number = useReduxToolkitSelector((state: ReduxToolkitRootState): number => state.counter.value);
  const message: string = useReduxToolkitSelector((state: ReduxToolkitRootState): string => state.message.text);

  return (
    <article>
      <h3>Typed state selection</h3>
      <p>Count: {count}</p>
      <p>Message: {message}</p>
    </article>
  );
};

export const TypedPayloadExample: FC = (): ReactElement => {
  const dispatch: ReduxToolkitAppDispatch = useReduxToolkitDispatch();

  const setCount = (amount: number): void => {
    dispatch(
      counterSlice.actions.setCount({
        amount,
      }),
    );
  };

  return (
    <article>
      <h3>Typed action payload</h3>
      <button
        type="button"
        onClick={() => {
          setCount(10);
        }}
      >
        Set count to 10
      </button>
      <button
        type="button"
        onClick={() => {
          setCount(25);
        }}
      >
        Set count to 25
      </button>
    </article>
  );
};

export const TypedDispatchExample: FC = (): ReactElement => {
  const dispatch: ReduxToolkitAppDispatch = useReduxToolkitDispatch();

  const increment = (): void => {
    dispatch(counterSlice.actions.increment());
  };

  const updateMessage = (): void => {
    dispatch(messageSlice.actions.setMessage("Updated with a typed dispatch"));
  };

  return (
    <article>
      <h3>Typed dispatch</h3>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={updateMessage}>
        Update message
      </button>
    </article>
  );
};

export const TypedSelectorExample: FC<ReduxToolkitTypeScriptExampleProps> = ({ title }): ReactElement => {
  const userName: string = useReduxToolkitSelector((state: ReduxToolkitRootState): string => state.user.name);
  const active: boolean = useReduxToolkitSelector((state: ReduxToolkitRootState): boolean => state.user.active);

  return (
    <article>
      <h3>{title}</h3>
      <p>Name: {userName}</p>
      <p>Active: {active ? "Yes" : "No"}</p>
    </article>
  );
};

export const TypedReducerExample: FC = (): ReactElement => {
  const count: number = useReduxToolkitSelector((state: ReduxToolkitRootState): number => state.counter.value);
  const dispatch: ReduxToolkitAppDispatch = useReduxToolkitDispatch();

  const incrementByAmount = (amount: number): void => {
    dispatch(counterSlice.actions.incrementByAmount(amount));
  };

  return (
    <article>
      <h3>Typed reducer payload</h3>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => {
          incrementByAmount(5);
        }}
      >
        Add 5
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxToolkitTypeScriptDemo: FC = (): ReactElement => {
  return (
    <Provider store={reduxToolkitTypeScriptStore}>
      <section>
        <h2>1. Typed Redux State</h2>
        <TypedStateExample />

        <h2>2. Typed Action Payloads</h2>
        <TypedPayloadExample />

        <h2>3. Typed Dispatch</h2>
        <TypedDispatchExample />

        <h2>4. Typed Selectors</h2>
        <TypedSelectorExample title="Selecting typed state values" />

        <h2>5. Typed Slice Reducers</h2>
        <TypedReducerExample />
      </section>
    </Provider>
  );
};

export default ReduxToolkitTypeScriptDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// TypeScript can describe Redux state with explicit interfaces.
// The satisfies operator can verify an initial state's shape while preserving its inferred type.
// PayloadAction<T> describes the type of data carried by a Redux Toolkit action.
// createSlice generates type-safe action creators from reducer definitions.
// TypeScript can infer RootState from store.getState.
// TypeScript can infer AppDispatch from store.dispatch.
// Typed selectors provide the Redux state type to selector functions.
// Typed dispatch prevents invalid action payloads from being dispatched.
// Immer allows mutation-style reducer syntax while Redux Toolkit maintains immutable state updates.
// Typed custom hooks can centralize Redux state and dispatch types for React components.
// Strong Redux typing catches incompatible state access and action payloads at compile time.
