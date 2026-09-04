import { createContext, useContext, useState } from "react";

const CountContext = createContext();

const ComponentA = () => {
  // extract the shared state value by using the useContext hook
  const count = useContext(CountContext);
  return <p>{count}</p>;
};

const ComponentB = () => {
  // extract the shared state value by using the Context.Consumer
  return (
    <CountContext.Consumer>
      {({ count }) => <p>{count}</p>}
    </CountContext.Consumer>
  );
};

const SharedState = () => {
  const [count, setCount] = useState(0);

  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);

  const value = { count, inc, dec };

  return (
    <CountContext.Provider value={value}>
      <ComponentA />
      <ComponentB />
    </CountContext.Provider>
  );
};

export default SharedState;
