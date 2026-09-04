/* eslint-disable react/prop-types */
import { useReducer } from "react";

// Several ways of using useReducer hook:
// 1. simple (state, newState) ... reducer returns the new state
// 2. simulate setState using Object API - spread the state and the action inside the reducer
// 3. simulate setState using Function API - accept the previous state as param, then spread the state and the action inside the reducer
// 4. dispatch an action

const countReducer = (state, action) => ({ ...state, ...action(state.count) });

function Counter({ step = 1, initialCount = 0 }) {
  const [{ count }, setState] = useReducer(countReducer, {
    count: initialCount,
  });

  const increment = () => {
    // Using the function returning an object API
    setState((currentState) => ({ count: currentState.count + step }));
  };

  const decrement = () => {
    // Using the function returning an object API
    setState((currentState) => ({ count: currentState.count + step }));
  };

  return (
    <div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <p>{count}</p>
    </div>
  );
}

export default Counter;
