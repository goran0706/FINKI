/* eslint-disable react/prop-types */
import { useMemo } from "react";

function fibonacci(num) {
  if (num < 2) return num;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

const MemoizedFibonacci = ({ number }) => {
  const sequence = useMemo(() => fibonacci(number), [number]);

  return (
    <div>
      <h1>Memoized Fibonacci</h1>
      <div>
        <p>Sequence 1:</p>
        <div>{sequence}</div>
      </div>
    </div>
  );
};

export default MemoizedFibonacci;
