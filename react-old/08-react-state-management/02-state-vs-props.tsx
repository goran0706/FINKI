import React, { useState } from "react";

/* 
  Props: 
  - Input passed to a component
  - Similar to function args
  - Immutable
  - Cause a re-render

  State:
  - Data managed by a component
  - Similar to local variables
  - Mutable
  - Cause a re-render
*/
const Counter = ({ initialCount }: { initialCount: number }) => {
  // keep components pure:
  // 1. never change props --> props should be immutable
  // 2. only change state when needed --> state is mutable
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialCount);

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
      <p>{count}</p>
    </div>
  );
};

const Title = ({ title }: { title: string }) => <h1>{title}</h1>;

const StateVsProps = () => {
  const initialCount = 0;

  return (
    <div>
      <Counter initialCount={initialCount} />
      <Title title="Props" />
    </div>
  );
};

export default StateVsProps;
