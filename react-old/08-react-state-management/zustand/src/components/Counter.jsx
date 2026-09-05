import useCountStore from "../hooks/useCountStore";

const Counter = () => {
  const count = useCountStore((state) => state.count);
  return <div>Counter: {count}</div>;
};

export default Counter;
