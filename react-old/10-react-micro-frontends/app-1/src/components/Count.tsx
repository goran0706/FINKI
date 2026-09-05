type CountProps = {
  count: number;
  changeBy: (n: number) => void;
};

const Count = ({ count, changeBy }: CountProps) => {
  return (
    <div className="box">
      <h2>Counter is: {count}</h2>
      <div>
        <button onClick={() => changeBy(-1)}>-</button>
        <button onClick={() => changeBy(1)}>+</button>
      </div>
    </div>
  );
};

export default Count;
