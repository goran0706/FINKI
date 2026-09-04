import { create } from "zustand";

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(() => ({ count: 0 })),
}));

const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore();
  return (
    <div>
      <h1>Counter</h1>
      <p>{count}</p>
      <div>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
        <button onClick={reset}>0</button>
      </div>
    </div>
  );
};

const Zustand = () => {
  return <Counter />;
};

export default Zustand;
