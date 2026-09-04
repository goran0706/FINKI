/* eslint-disable react/prop-types */

import { useReducer } from "react";

// Several ways of using useReducer hook:
// 1. simple (state, newState) ... reducer returns the new state
// 2. simulate setState using Object API - spread the state and the action inside the reducer
// 3. simulate setState using Function API - accept the previous state as param, then spread the state and the action inside the reducer
// 4. dispatch an action

function countReducer(state, newState) {
  return newState; // just return the new state
}

function Counter({ step = 1, initialCount = 0 }) {
  const [count, dispatch] = useReducer(countReducer, initialCount);

  const increment = () => dispatch(count + step); // increment the counter and pass the new state
  const decrement = () => dispatch(count - step); // decrement the counter and pass the new state

  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <p>{count}</p>
    </div>
  );
}

export default Counter;
