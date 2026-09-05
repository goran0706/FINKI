/* eslint-disable react/prop-types */
import React from "react";

const CounterContext = React.createContext();

function CounterProvider({ step = 1, initialCount = 0, ...props }) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      const change = action.step ?? step;
      switch (action.type) {
        case "increment": {
          return { ...state, count: state.count + change };
        }
        case "decrement": {
          return { ...state, count: state.count - change };
        }
        default: {
          throw new Error(`Unhandled action type: ${action.type}`);
        }
      }
    },
    { count: initialCount }
  );

  const value = [state, dispatch];
  return <CounterContext.Provider value={value} {...props} />;
}

function useCounter() {
  const context = React.useContext(CounterContext);
  if (context === undefined) {
    throw new Error(`useCounter must be used within a CounterProvider`);
  }
  return context;
}

// Pass the dispatch down the helper function - Context Module Functions
const increment = (dispatch) => dispatch({ type: "increment" });
const decrement = (dispatch) => dispatch({ type: "decrement" });

export { CounterProvider, decrement, increment, useCounter };

// src/screens/counter.js
// import { useCounter, increment, decrement } from "context/counter";

function Counter() {
  const [state, dispatch] = useCounter();
  return (
    <div>
      <div>Current Count: {state.count}</div>
      <button onClick={() => decrement(dispatch)}>-</button>
      <button onClick={() => increment(dispatch)}>+</button>
    </div>
  );
}

export default Counter;
