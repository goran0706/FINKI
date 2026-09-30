/**
 * useReducer
 * ==========
 *
 * `useReducer` is a React Hook that lets you add a reducer to your component. It is often preferable to
 * `useState` when you have complex state logic that involves multiple sub-values or when the next state
 * depends on the previous one.
 *
 * A reducer is a pure, deterministic function (state, action) => nextState that calculates the next
 * state from the current state and a dispatched action object. Named after Array.prototype.reduce(),
 * it accumulates a sequence of action events into a single updated state representation over time.
 *
 * Extracting state transition logic into a reducer consolidates event handler updates into a single
 * location outside the component tree. A reducer must remain strictly functional, treating state as
 * strictly immutable by returning fresh object copies without performing asynchronous side effects.
 *
 * Calling `useReducer` returns an array with two elements: the current `state` and a `dispatch` function.
 * You pass a pure reducer function `(state, action) => nextState` along with an initial state object.
 * Dispatching an action sends information to the reducer to calculate the next state, keeping state transition
 * logic isolated outside the component render tree.
 */

import React, { useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface and Type Definitions
// ---------------------------------------------------------------------

export interface CounterState {
  readonly count: number;
  readonly step: number;
}

export type CounterAction =
  { type: "increment" } | { type: "decrement" } | { type: "setStep"; payload: number } | { type: "reset" };

export interface BasicReducerProps {
  readonly initialCount: number;
}

export interface LazyReducerProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Reducer Implementation
// ---------------------------------------------------------------------

export const initialCounterState: CounterState = {
  count: 0,
  step: 1,
};

export const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialCounterState;
    default:
      return state;
  }
};

export const createInitialState = (initialCount: number): CounterState => {
  return {
    count: initialCount,
    step: 1,
  };
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const BasicReducerCounter: React.FC<BasicReducerProps> = ({ initialCount }) => {
  const [state, dispatch] = useReducer(counterReducer, {
    ...initialCounterState,
    count: initialCount,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button type="button" onClick={() => dispatch({ type: "increment" })}>
        Increment
      </button>
      <button type="button" onClick={() => dispatch({ type: "decrement" })}>
        Decrement
      </button>
      <button type="button" onClick={() => dispatch({ type: "setStep", payload: 5 })}>
        Set Step to 5
      </button>
      <button type="button" onClick={() => dispatch({ type: "reset" })}>
        Reset
      </button>
    </div>
  );
};

export const LazyInitReducerCounter: React.FC<LazyReducerProps> = ({ initialCount }) => {
  const [state, dispatch] = useReducer(counterReducer, initialCount, createInitialState);

  return (
    <div>
      <p>Lazy Initial Count: {state.count}</p>
      <button type="button" onClick={() => dispatch({ type: "increment" })}>
        Increment Lazy
      </button>
      <button type="button" onClick={() => dispatch({ type: "reset" })}>
        Reset Lazy
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const UseReducerContainer: React.FC = () => {
  return (
    <div>
      <h1>02 - useReducer</h1>

      <h2>1. Basic Action Dispatching</h2>
      <BasicReducerCounter initialCount={0} />

      <h2>2. Lazy Initialization</h2>
      <LazyInitReducerCounter initialCount={10} />
    </div>
  );
};

export default UseReducerContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Calling useReducer returns the current state and a dispatch function to trigger state updates.
// - Reducer functions must remain pure, returning the next state based on current state and action.
// - Dispatching actions decouples state transition logic from event handling inside components.
// - The dispatch function reference identity stays stable across component re-renders.
// - Passing an initializer function as the third argument enables lazy initial state computation.
