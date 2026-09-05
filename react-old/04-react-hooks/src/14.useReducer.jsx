/* eslint-disable react/prop-types */
import { useReducer } from "react";

// Several ways of using useReducer hook:
// 1. simple (state, newState) ... reducer returns the new state
// 2. simulate setState using Object API - spread the state and the action inside the reducer
// 3. simulate setState using Function API - accept the previous state as param, then spread the state and the action inside the reducer
// 4. dispatch an action

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Using the classic react redux convention
function countReducer(state, action) {
  const { type, step } = action;
  switch (type) {
    case INCREMENT:
      return { count: state.count + step };
    case DECREMENT:
      return { count: state.count - step };
    default:
      throw new Error(`Unsupported action type: ${type}`);
  }
}

function Counter({ step = 1, initialCount = 0 }) {
  const [{ count }, dispatch] = useReducer(countReducer, {
    count: initialCount,
  });

  const increment = () => dispatch({ type: INCREMENT, step });
  const decrement = () => dispatch({ type: DECREMENT, step });

  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <p>{count}</p>
    </div>
  );
}

export default Counter;
