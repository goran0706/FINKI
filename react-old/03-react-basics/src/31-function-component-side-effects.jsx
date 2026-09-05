import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const FunctionComponentSideEffects = (props) => {
  const { greet, message } = props; // component props
  const [count, setCount] = useState(0); // component state

  const decrement = () => setCount((count) => count - 1);
  const increment = () => setCount((count) => count + 1);

  useEffect(() => console.log("runs after each render"));
  useEffect(() => console.log("runs after the initial render only"), []);
  useEffect(() => console.log("runs after a dependency changes only"), [count]);
  useEffect(() => () => console.log("runs when component is removed"), [count]);

  return (
    <div>
      <h1>Props in Class Component</h1>
      <h2>{greet}</h2>
      <p>{message}</p>
      <h1>State in Class Component</h1>
      <div>
        <p>Count is: {count}</p>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

FunctionComponentSideEffects.propTypes = {
  greet: PropTypes.string,
  message: PropTypes.string,
  initialCount: PropTypes.number,
};

FunctionComponentSideEffects.defaultProps = {
  greet: "",
  message: "",
  initialCount: 0,
};

export default FunctionComponentSideEffects;
