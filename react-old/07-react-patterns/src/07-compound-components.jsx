/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const CounterContext = createContext();

const Counter = ({ children }) => {
  const [count, setCount] = useState(0);
  const increment = () => setCount((count) => ++count);
  const decrement = () => setCount((count) => --count);
  return (
    <CounterContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  );
};

const Count = () => {
  const { count } = useContext(CounterContext);
  return <p>{count}</p>;
};

const Increment = () => {
  const { increment } = useContext(CounterContext);
  return <button onClick={increment}>Increment</button>;
};

const Decrement = () => {
  const { decrement } = useContext(CounterContext);
  return <button onClick={decrement}>Decrement</button>;
};

Counter.Count = Count;
Counter.Increment = Increment;
Counter.Decrement = Decrement;

export default Counter;
