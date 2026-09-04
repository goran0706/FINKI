/* eslint-disable no-unused-vars */
import { useReducer } from "react";

const ActionTypes = Object.freeze({
  resetCount: "RESET_COUNT",
  decrementCount: "DECREMENT_COUNT",
  incrementCount: "INCREMENT_COUNT",
  decrementStep: "DECREMENT_STEP",
  incrementStep: "INCREMENT_STEP",
});

const Action = {
  resetCount: (value) => ({ type: ActionTypes.resetCount, payload: value }),
  decrementCount: () => ({ type: ActionTypes.decrementCount }),
  incrementCount: () => ({ type: ActionTypes.incrementCount }),
  decrementStep: () => ({ type: ActionTypes.decrementStep }),
  incrementStep: () => ({ type: ActionTypes.incrementStep }),
};

const countReducer = (state, action) => {
  const { count, step } = state;
  switch (action.type) {
    case ActionTypes.resetCount:
      return { ...state, count: action.payload };
    case ActionTypes.decrementCount:
      return { ...state, count: count - step };
    case ActionTypes.incrementCount:
      return { ...state, count: count + step };
    case ActionTypes.decrementStep:
      return { ...state, step: step - 1 };
    case ActionTypes.incrementStep:
      return { ...state, step: step + 1 };
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};

const initialState = {
  count: 10,
  step: 1,
};

// expensive state initializer
const initializeState = (initialCount, initialStep) => {
  return {
    count: initialCount,
    step: initialStep,
  };
};

const UseReducerCount = () => {
  const [{ count, step }, dispatch] = useReducer(countReducer, initialState);

  return (
    <div className="box">
      <div>Count: {count}</div>
      <div>Step: {step}</div>
      <div>
        <p>Count Controls</p>
        <button onClick={() => dispatch(Action.resetCount(initialState.count))}>
          Reset
        </button>
        <button onClick={() => dispatch(Action.decrementCount())}>
          Decrement
        </button>
        <button onClick={() => dispatch(Action.incrementCount())}>
          Increment
        </button>
      </div>
      <div>
        <p>Step Controls: step = {step}</p>
        <button onClick={() => dispatch(Action.decrementStep())}>
          Decrement
        </button>
        <button onClick={() => dispatch(Action.incrementStep())}>
          Increment
        </button>
      </div>
    </div>
  );
};

export default UseReducerCount;
