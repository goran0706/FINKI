/* eslint-disable react/prop-types */
import { memo, useCallback, useState } from "react";

const CountButton = ({ count, onClick }) => (
  <button onClick={onClick}>{count}</button>
);

// Memoize the component and don't rerender it unless the props are changed since the last render.
const MemoizedCountButton = memo(CountButton);

const DualCounter = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  // Memoize the functions so the props onClick passed to the CountButton remains the same between rerenders
  const inc1 = useCallback(() => setCount1((count) => ++count), []);
  const inc2 = useCallback(() => setCount2((count) => ++count), []);

  return (
    <>
      <MemoizedCountButton count={count1} onClick={inc1} />
      <MemoizedCountButton count={count2} onClick={inc2} />
    </>
  );
};

export default DualCounter;
