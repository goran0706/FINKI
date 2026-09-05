/* eslint-disable react/prop-types */
// Several ways of using useReducer hook:
// 1. simple (state, newState) ... reducer returns the new state
// 2. simulate setState using Object API - spread the state and the action inside the reducer
// 3. simulate setState using Function API - accept the previous state as param, then spread the state and the action inside the reducer
// 4. dispatch an action

import { useReducer } from "react";

function countReducer(state, step) {
  return state + step; // increment the counter and return the new state
}

function Counter({ step = 1, initialCount = 0 }) {
  const [count, changeCount] = useReducer(countReducer, initialCount);

  const increment = () => changeCount(step); // pass the new value
  const decrement = () => changeCount(step); // pass the new value

  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <p>{count}</p>
    </div>
  );
}

export default Counter;
