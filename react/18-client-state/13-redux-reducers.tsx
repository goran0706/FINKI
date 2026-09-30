/**
 * Redux Reducers
 * ==============
 *
 * A Redux reducer is a pure function that receives the current state and a dispatched action,
 * then calculates and returns the next state. Reducers contain the state-transition logic for
 * a Redux application and determine how each action changes the state tree.
 *
 * A reducer must not mutate the existing state. Instead, it returns a new state value whenever
 * the action requires a change. Reducers must also avoid side effects such as API requests,
 * timers, random values, or modifying variables outside the reducer.
 *
 * Reducers commonly use the action's type to select a state transition. A switch statement is
 * a traditional way to handle action types, although modern Redux applications commonly use
 * Redux Toolkit's createSlice to define reducer logic.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

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

export interface ReducerExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
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
      return {
        count: 0,
      };
  }
};

export const PureReducerExample: FC = (): ReactElement => {
  const [state, setState] = useState<CounterState>({
    count: 0,
  });

  const applyAction = (action: CounterAction): void => {
    setState((currentState: CounterState): CounterState => counterReducer(currentState, action));
  };

  return (
    <div>
      <p>Count: {state.count}</p>
      <button
        type="button"
        onClick={() => {
          applyAction({
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
          applyAction({
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
          applyAction({
            type: "counter/reset",
          });
        }}
      >
        Reset
      </button>
    </div>
  );
};

export const ImmutableReducerExample: FC = (): ReactElement => {
  const [state, setState] = useState<CounterState>({
    count: 10,
  });

  const increment = (): void => {
    setState((currentState: CounterState): CounterState =>
      counterReducer(currentState, {
        type: "counter/incremented",
        payload: 5,
      }),
    );
  };

  return (
    <div>
      <p>Current count: {state.count}</p>
      <button type="button" onClick={increment}>
        Add 5
      </button>
    </div>
  );
};

export const ReducerPurityExample: FC<ReducerExampleProps> = ({ title }): ReactElement => {
  const initialState: CounterState = {
    count: 20,
  };

  const firstAction: IncrementAction = {
    type: "counter/incremented",
    payload: 5,
  };

  const secondAction: IncrementAction = {
    type: "counter/incremented",
    payload: 5,
  };

  const firstResult: CounterState = counterReducer(initialState, firstAction);
  const secondResult: CounterState = counterReducer(initialState, firstAction);

  return (
    <article>
      <h3>{title}</h3>
      <p>Initial count: {initialState.count}</p>
      <p>First result: {firstResult.count}</p>
      <p>Second result: {secondResult.count}</p>
      <p>Same input produces the same output: {firstResult.count === secondResult.count ? "Yes" : "No"}</p>
    </article>
  );
};

export const UnknownActionExample: FC = (): ReactElement => {
  const state: CounterState = {
    count: 10,
  };

  const unrelatedAction = {
    type: "some/other-event",
  };

  const result: CounterState = counterReducer(state, unrelatedAction as CounterAction);

  return (
    <article>
      <h3>Unhandled action</h3>
      <p>Current count: {state.count}</p>
      <p>After unrelated action: {result.count}</p>
      <p>A reducer should return the current state when an action does not belong to that reducer.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxReducersDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Reducer State Transitions</h2>
      <PureReducerExample />

      <h2>2. Immutable State Updates</h2>
      <ImmutableReducerExample />

      <h2>3. Reducer Purity</h2>
      <ReducerPurityExample title="Same input, same output" />

      <h2>4. Unhandled Actions</h2>
      <UnknownActionExample />
    </section>
  );
};

export default ReduxReducersDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Redux reducer receives the current state and an action.
// A reducer calculates and returns the next state.
// Reducers should be pure functions.
// Reducers must not mutate the existing state.
// Reducers should not perform side effects such as API requests or timers.
// A reducer commonly uses action.type to select the appropriate state transition.
// A reducer can return a new object containing the updated state.
// Unhandled actions should return the current state unchanged.
// The same state and action inputs should produce the same reducer result.
// Reducer logic describes how actions transition application state.
