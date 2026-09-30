/**
 * Redux Store
 * ===========
 *
 * The Redux store is the central object that holds the current Redux state tree and coordinates
 * state updates. It provides the mechanisms for reading the current state, dispatching actions,
 * and subscribing to state changes.
 *
 * A store is created with a reducer that defines how actions produce the next state. Application
 * code does not directly assign to the store's state. Instead, actions are dispatched, the reducer
 * calculates the next state, and the store makes that state available to subscribers.
 *
 * In React applications, React-Redux connects the store to the component tree through Provider.
 * Components can then read selected state with useSelector and dispatch actions with useDispatch.
 *
 * Modern Redux applications generally create stores with Redux Toolkit's configureStore. The
 * lower-level Redux store API is shown here to demonstrate the underlying store responsibilities.
 */

import type { Dispatch } from "redux";
import { legacy_createStore as createStore, type Store } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterState {
  readonly count: number;
}

export interface IncrementAction {
  readonly type: "counter/incremented";
  readonly payload: number;
}

export interface DecrementAction {
  readonly type: "counter/decremented";
  readonly payload: number;
}

export interface ResetAction {
  readonly type: "counter/reset";
}

export type CounterAction = IncrementAction | DecrementAction | ResetAction;

export interface StoreCounterProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: CounterState = {
  count: 0,
};

export const counterReducer = (state: CounterState = initialState, action: CounterAction): CounterState => {
  switch (action.type) {
    case "counter/incremented":
      return {
        count: state.count + action.payload,
      };

    case "counter/decremented":
      return {
        count: state.count - action.payload,
      };

    case "counter/reset":
      return initialState;

    default:
      return state;
  }
};

export const reduxStore: Store<CounterState, CounterAction> = createStore(counterReducer);

export const StoreCounter: FC<StoreCounterProps> = ({ title }): ReactElement => {
  const count: number = useSelector((state: CounterState): number => state.count);
  const dispatch: Dispatch<CounterAction> = useDispatch<Dispatch<CounterAction>>();

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "counter/incremented",
            payload: 1,
          });
        }}
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "counter/decremented",
            payload: 1,
          });
        }}
      >
        Decrement
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "counter/reset",
          });
        }}
      >
        Reset
      </button>
    </article>
  );
};

export const StoreSubscriptionExample: FC = (): ReactElement => {
  const count: number = useSelector((state: CounterState): number => state.count);

  return (
    <article>
      <h3>Store state subscription</h3>
      <p>This component reads the current store state through useSelector.</p>
      <p>Current count: {count}</p>
    </article>
  );
};

export const StoreDispatchExample: FC = (): ReactElement => {
  const dispatch: Dispatch<CounterAction> = useDispatch<Dispatch<CounterAction>>();

  const increment = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 5,
    });
  };

  return (
    <article>
      <h3>Dispatching through the store</h3>
      <button type="button" onClick={increment}>
        Add 5
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxStoreDemo: FC = (): ReactElement => {
  return (
    <Provider store={reduxStore}>
      <section>
        <h2>1. The Redux Store Holds State</h2>
        <StoreCounter title="Centralized counter state" />

        <h2>2. Components Read Store State</h2>
        <StoreSubscriptionExample />

        <h2>3. Components Dispatch Actions</h2>
        <StoreDispatchExample />
      </section>
    </Provider>
  );
};

export default ReduxStoreDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Redux store holds the application's current Redux state tree.
// A store is created with a reducer that calculates state transitions.
// Components should not directly assign values to Redux store state.
// Actions are dispatched to request state changes.
// The store passes dispatched actions to its reducer.
// The reducer calculates the next state from the current state and action.
// React-Redux Provider makes a Redux store available to descendant components.
// useSelector reads selected state from the Redux store.
// useDispatch provides access to the store's dispatch function.
// Subscribers are notified when the store state changes.
// Modern Redux applications generally use configureStore from Redux Toolkit.
