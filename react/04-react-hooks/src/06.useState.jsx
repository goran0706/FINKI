import { useState } from "react";

const UseState = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // Update based on the previous state
    setCount(count + 1); // 0 + 1 = 1
    setCount(count + 1); // 0 + 1 = 1
    setCount(count + 1); // 0 + 1 = 1
  };

  const handleClick2 = () => {
    // Update based on the current state
    setCount((count) => count + 1); // 0 + 1 = 1
    setCount((count) => count + 1); // 1 + 1 = 2
    setCount((count) => count + 1); // 2 + 1 = 3
  };

  return (
    <div>
      <div>The current count is {count}</div>
      <div>
        <button onClick={handleClick}>Update Based On Previous State</button>
        <button onClick={handleClick2}>Update Based On Current State</button>
      </div>
    </div>
  );
};

export default UseState;
