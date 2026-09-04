import { useEffect, useState } from 'react';

export default function LocalStorage() {
  const [count, setCount] = useState(
    () => parseFloat(localStorage.getItem('count')) || 0
  );

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
