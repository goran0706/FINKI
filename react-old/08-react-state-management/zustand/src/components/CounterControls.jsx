import useCountStore from "../hooks/useCountStore";

const CounterControls = () => {
  const dec = useCountStore((state) => state.dec);
  const inc = useCountStore((state) => state.inc);

  return (
    <div>
      <button onClick={dec}>-</button>
      <button onClick={inc}>+</button>
    </div>
  );
};

export default CounterControls;
