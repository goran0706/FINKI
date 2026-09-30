/**
 * Redux Toolkit Slices
 * ====================
 *
 * A Redux Toolkit slice is a self-contained module that defines a section of Redux state together
 * with the reducer functions that can update that state. createSlice generates the slice reducer,
 * action creators, and action type strings from the provided slice name and reducer definitions.
 *
 * A slice's name becomes the namespace for its generated action types, while each reducer key
 * becomes the action name. For example, a slice named "counter" with an "increment" reducer
 * generates an action type of "counter/increment".
 *
 * Slices are intended to organize Redux logic by feature. A slice can contain the state and
 * synchronous update logic belonging to one feature, while configureStore combines multiple
 * slice reducers into the application's root state.
 *
 * Redux Toolkit uses Immer internally, so slice reducers can use mutation-style syntax such as
 * state.value += 1. Immer converts those changes into an immutable state update.
 */

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterSliceState {
  readonly value: number;
}

export interface UserSliceState {
  readonly name: string;
  readonly active: boolean;
}

export interface SliceExampleProps {
  readonly title: string;
}

export interface SetNamePayload {
  readonly name: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  } satisfies CounterSliceState,
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

export const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "John Doe",
    active: true,
  } satisfies UserSliceState,
  reducers: {
    setName(state, action: PayloadAction<SetNamePayload>): void {
      state.name = action.payload.name;
    },
    setActive(state, action: PayloadAction<boolean>): void {
      state.active = action.payload;
    },
  },
});

export const slicesStore = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    user: userSlice.reducer,
  },
});

export type SlicesRootState = ReturnType<typeof slicesStore.getState>;

export type SlicesAppDispatch = typeof slicesStore.dispatch;

export const CounterSliceExample: FC = (): ReactElement => {
  const count: number = useSelector((state: SlicesRootState): number => state.counter.value);
  const dispatch: SlicesAppDispatch = useDispatch();

  return (
    <article>
      <h3>Counter slice</h3>
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

export const UserSliceExample: FC = (): ReactElement => {
  const name: string = useSelector((state: SlicesRootState): string => state.user.name);
  const active: boolean = useSelector((state: SlicesRootState): boolean => state.user.active);
  const dispatch: SlicesAppDispatch = useDispatch();

  return (
    <article>
      <h3>User slice</h3>
      <p>Name: {name}</p>
      <p>Active: {active ? "Yes" : "No"}</p>
      <button
        type="button"
        onClick={() => {
          dispatch(
            userSlice.actions.setName({
              name: "Jane Doe",
            }),
          );
        }}
      >
        Change name
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(userSlice.actions.setActive(!active));
        }}
      >
        Toggle active
      </button>
    </article>
  );
};

export const GeneratedActionsExample: FC = (): ReactElement => {
  const incrementAction = counterSlice.actions.increment();
  const amountAction = counterSlice.actions.incrementByAmount(10);
  const nameAction = userSlice.actions.setName({
    name: "Alex Smith",
  });

  return (
    <article>
      <h3>Generated slice actions</h3>
      <p>Counter increment type: {incrementAction.type}</p>
      <p>Counter amount type: {amountAction.type}</p>
      <p>User name type: {nameAction.type}</p>
      <p>createSlice generates action creators and action type strings from the slice definition.</p>
    </article>
  );
};

export const SliceNamespaceExample: FC<SliceExampleProps> = ({ title }): ReactElement => {
  const counterAction = counterSlice.actions.increment();
  const userAction = userSlice.actions.setActive(true);

  return (
    <article>
      <h3>{title}</h3>
      <p>Counter action: {counterAction.type}</p>
      <p>User action: {userAction.type}</p>
      <p>
        The slice name forms the namespace portion of generated action types, helping distinguish actions from different
        features.
      </p>
    </article>
  );
};

export const FeatureSliceExample: FC = (): ReactElement => {
  const counter: CounterSliceState = slicesStore.getState().counter;
  const user: UserSliceState = slicesStore.getState().user;

  return (
    <article>
      <h3>Feature-oriented state</h3>
      <p>Counter state: {counter.value}</p>
      <p>User state: {user.name}</p>
      <p>Each slice owns the state and reducer logic for its feature.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxToolkitSlicesDemo: FC = (): ReactElement => {
  return (
    <Provider store={slicesStore}>
      <section>
        <h2>1. Defining a Counter Slice</h2>
        <CounterSliceExample />

        <h2>2. Defining a User Slice</h2>
        <UserSliceExample />

        <h2>3. Generated Actions</h2>
        <GeneratedActionsExample />

        <h2>4. Slice Action Namespaces</h2>
        <SliceNamespaceExample title="Feature-specific action types" />

        <h2>5. Organizing State by Feature</h2>
        <FeatureSliceExample />
      </section>
    </Provider>
  );
};

export default ReduxToolkitSlicesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Redux Toolkit slice owns a section of Redux state and its update logic.
// createSlice creates a slice reducer from a state value and reducer definitions.
// The slice name namespaces the generated action types.
// Each reducer definition produces a corresponding action creator.
// createSlice automatically generates action type strings.
// Slice reducers can use mutation-style syntax because Redux Toolkit uses Immer.
// Immer converts those apparent mutations into immutable state updates.
// A slice can define multiple reducers for different state transitions.
// Multiple slices can be combined in configureStore.
// Feature-based slices keep related state, reducers, and actions together.
// TypeScript can infer action and state types from createSlice definitions.
