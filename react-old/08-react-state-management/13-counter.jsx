import { useRef, useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const clicksCountRef = useRef(0);

  // store previous state between re-renders
  const previousCount = countRef.current ? countRef.current.value : 0;

  // persist and track clicks count between re-renders
  const clicksCount = clicksCountRef.current;

  const increment = () => {
    clicksCountRef.current = clicksCountRef.current + 1;
    setCount((count) => count + 1);
  };

  const decrement = () => {
    clicksCountRef.current++;
    setCount((count) => count - 1);
  };

  const reset = () => {
    clicksCountRef.current++;
    setCount(0);
  };

  return (
    <div>
      <h1>Counter</h1>
      <div className='d-flex flex-column'>
        <p>Times clicked is: {clicksCount}</p>
        <p>Previous count is: {previousCount}</p>
        <p>Current count is: {count}</p>
      </div>
      <div className='d-flex flex-column'>
        <input
          className='form-control'
          type='number'
          readOnly
          value={count}
          ref={countRef}
        />
      </div>
      <div className='d-flex gap-1 mt-2'>
        <button className='btn btn-primary' onClick={decrement}>
          Decrement
        </button>
        <button className='btn btn-primary' onClick={reset}>
          Reset
        </button>
        <button className='btn btn-primary' onClick={increment}>
          Increment
        </button>
      </div>
    </div>
  );
};

export default Counter;
