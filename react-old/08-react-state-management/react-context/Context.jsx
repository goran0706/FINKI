const { createContext, useState, useContext } = require("react");

const SomeContext = createContext();

const ContextProvider = ({ children }) => {
  const [someValue, setSomeValue] = useState(0);

  const decrement = () => setSomeValue((v) => v - 1);
  const increment = () => setSomeValue((v) => v + 1);

  const value = { someValue, decrement, increment };
  return <SomeContext.Provider value={value}>{children}</SomeContext.Provider>;
};

const App = () => {
  const { value, decrement, increment } = useContext(SomeContext);

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
};
