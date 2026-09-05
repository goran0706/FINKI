import { useState } from "react";

export default function StateInFunctionComponentUseState() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
