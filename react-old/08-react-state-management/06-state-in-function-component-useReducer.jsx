import { useReducer } from "react";

// Action Types
const INCREMENT = "increment";
const DECREMENT = "decrement";

// Action Creators
const decrement = { type: DECREMENT, payload: 1 };
const increment = { type: INCREMENT, payload: 1 };

// Action Dispatch Methods
const decrementCount = (dispatch) => dispatch(decrement);
const incrementCount = (dispatch) => dispatch(increment);

// Count Reducer
const reducer = (state, action) => {
  const { count } = state;
  const { type, payload } = action;

  switch (type) {
    case INCREMENT:
      return { ...state, count: count + payload };
    case DECREMENT:
      return { ...state, count: count - payload };
    default:
      return state;
  }
};

// Initial State
const initialState = { count: 0 };

export default function StateInFunctionComponentUseReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <button onClick={() => decrementCount(dispatch)}>-</button>
      <p>Count: {state.count}</p>
      <button onClick={() => incrementCount(dispatch)}>+</button>
    </div>
  );
}
