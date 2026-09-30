/**
 * Redux Toolkit
 * ==============
 *
 * Redux Toolkit (RTK) is the standard way to write Redux logic. It provides APIs that reduce
 * the boilerplate required by traditional Redux while preserving the core Redux model of
 * state, actions, reducers, dispatching, and a centralized store.
 *
 * Redux Toolkit includes configureStore for store setup, createSlice for defining state and
 * reducer logic, createAction for action creators, createReducer for reducer logic, and
 * additional utilities for asynchronous logic and data fetching. configureStore also provides
 * useful default middleware and Redux DevTools integration.
 *
 * createSlice combines a slice's state, reducer functions, action types, and generated action
 * creators into one definition. Its reducers can use apparent state mutation because Redux
 * Toolkit uses Immer internally to produce immutable state updates.
 */

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ToolkitCounterState {
  readonly value: number;
}

export interface ToolkitExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: ToolkitCounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state): void {
      state.value += 1;
    },
    decrement(state): void {
      state.value -= 1;
    },
    incrementByAmount(state, action: PayloadAction<number>): void {
      state.value += action.payload;
    },
    reset(state): void {
      state.value = 0;
    },
  },
});

export const toolkitStore = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export type ToolkitRootState = ReturnType<typeof toolkitStore.getState>;
export type ToolkitAppDispatch = typeof toolkitStore.dispatch;

export const ToolkitCounterExample: FC = (): ReactElement => {
  const count: number = useSelector((state: ToolkitRootState): number => state.counter.value);
  const dispatch: ToolkitAppDispatch = useDispatch();

  return (
    <article>
      <h3>Redux Toolkit counter</h3>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => {
          dispatch(counterSlice.actions.increment());
        }}
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(counterSlice.actions.decrement());
        }}
      >
        Decrement
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(counterSlice.actions.incrementByAmount(5));
        }}
      >
        Add 5
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(counterSlice.actions.reset());
        }}
      >
        Reset
      </button>
    </article>
  );
};

export const ToolkitGeneratedActionsExample: FC = (): ReactElement => {
  const dispatch: ToolkitAppDispatch = useDispatch();

  const increment = counterSlice.actions.increment();
  const incrementByAmount: PayloadAction<number> = counterSlice.actions.incrementByAmount(10);

  return (
    <article>
      <h3>Generated action creators</h3>
      <p>createSlice generates action creators from the reducer names.</p>
      <button
        type="button"
        onClick={() => {
          dispatch(increment);
        }}
      >
        Dispatch increment
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(incrementByAmount);
        }}
      >
        Dispatch +10
      </button>
    </article>
  );
};

export const ToolkitImmerExample: FC<ToolkitExampleProps> = ({ title }): ReactElement => {
  const dispatch: ToolkitAppDispatch = useDispatch();

  return (
    <article>
      <h3>{title}</h3>
      <p>
        The slice reducer can use state.value += 1 syntax because Redux Toolkit uses Immer internally to produce an
        immutable next state.
      </p>
      <button
        type="button"
        onClick={() => {
          dispatch(counterSlice.actions.increment());
        }}
      >
        Increment with Immer-backed reducer
      </button>
    </article>
  );
};

export const ToolkitStoreExample: FC = (): ReactElement => {
  const state: ToolkitRootState = toolkitStore.getState();

  return (
    <article>
      <h3>Configured store</h3>
      <p>Initial count from the store: {state.counter.value}</p>
      <p>configureStore creates the Redux store from the supplied reducer configuration.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxToolkitDemo: FC = (): ReactElement => {
  return (
    <Provider store={toolkitStore}>
      <section>
        <h2>1. Redux Toolkit Counter</h2>
        <ToolkitCounterExample />

        <h2>2. Generated Action Creators</h2>
        <ToolkitGeneratedActionsExample />

        <h2>3. Immer-Backed Reducer Updates</h2>
        <ToolkitImmerExample title="Writing simpler immutable updates" />

        <h2>4. Redux Toolkit Store Setup</h2>
        <ToolkitStoreExample />
      </section>
    </Provider>
  );
};

export default ReduxToolkitDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Redux Toolkit is the standard way to write Redux logic.
// Redux Toolkit reduces the boilerplate required by traditional Redux.
// configureStore creates a Redux store with useful defaults.
// createSlice combines state, reducers, action types, and action creators.
// createSlice automatically generates action creators for its reducers.
// PayloadAction<T> types an action payload in a slice reducer.
// Redux Toolkit uses Immer internally for immutable state updates.
// Immer allows reducers to use apparent mutation syntax safely.
// The resulting Redux state is still updated immutably.
// Redux Toolkit can infer the store's RootState and dispatch types.
// Redux Toolkit also provides APIs for asynchronous logic and data fetching.
// Redux Toolkit is built on the same core Redux concepts of state, actions, reducers, and dispatch.
