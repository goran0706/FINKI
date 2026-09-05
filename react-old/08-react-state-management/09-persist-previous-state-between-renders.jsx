import React, { useRef, useState } from "react";

const PersistPreviousStateBetweenRenders = () => {
  const [count, setCount] = useState(0);
  const value = useRef(0);

  const dec = () => {
    value.current = count; // prev value
    setCount((count) => --count);
  };

  const inc = () => {
    value.current = count; // prev value
    setCount((count) => ++count);
  };

  return (
    <div>
      <h1>Persist value after re-renders</h1>
      <p>Persisted value: {value.current}</p>
      <div>
        <button onClick={dec}>-</button>
        <p>{count}</p>
        <button onClick={inc}>+</button>
      </div>
    </div>
  );
};

export default PersistPreviousStateBetweenRenders;
