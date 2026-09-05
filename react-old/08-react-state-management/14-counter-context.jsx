/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

// Context
const CounterContext = createContext();

// Context Provider
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useState(0);
  return (
    <CounterContext.Provider value={[state, dispatch]}>
      {children}
    </CounterContext.Provider>
  );
};

// Counter Context Hook
const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) throw new Error('useCounter not inside a counter context');
  return context;
};

// Context Consumer
const Counter = () => {
  const [count, dispatch] = useCounter();
  const increment = () => dispatch(count + 1);
  const decrement = () => dispatch(count - 1);
  const reset = () => dispatch(0);
  return (
    <div className='d-flex gap-1'>
      <button className='btn btn-primary' onClick={decrement}>
        Decrement
      </button>
      <button className='btn btn-secondary' onClick={reset}>
        Reset
      </button>
      <button className='btn btn-primary' onClick={increment}>
        Increment
      </button>
    </div>
  );
};

// Context Consumer
const CounterDisplay = () => {
  const [count] = useCounter();
  return <h1>The current count is: {count}</h1>;
};

const CounterContextApp = () => (
  <ContextProvider>
    <Counter />
    <CounterDisplay />
  </ContextProvider>
);

export default CounterContextApp;
