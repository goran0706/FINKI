import PropTypes from "prop-types";
import { useState } from "react";

const FunctionComponentState = (props) => {
  // Unlike the setState method, the useState hook does not allow for partial state updates.
  // The new state needs to be completely updated
  // 1. state updates of primitive types
  // 2. state updates of objects - spread the object, then override the needed properties
  // 3. state updates of arrays - spread the array, then arr/remove/edit the needed elements
  // 4. state updates of arrays of objects - using map method we can update only the specific object and just return the other objects
  const [count, setCount] = useState(0); // component state
  const { greet, message } = props; // component props

  const decrement = () => setCount((count) => count - 1);
  const increment = () => setCount((count) => count + 1);

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

FunctionComponentState.propTypes = {
  greet: PropTypes.string,
  message: PropTypes.string,
  initialCount: PropTypes.number,
};

FunctionComponentState.defaultProps = {
  greet: "",
  message: "",
  initialCount: 0,
};

export default FunctionComponentState;
