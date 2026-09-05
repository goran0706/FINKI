import { useState } from "react";

const UseState = () => {
  // We can use the state hook similar to React class state setState method
  // Remember: When using state hook we need to replace the state object entirely and edit the wanted properties.
  // State cannot be updated partially like using 'setState'. Don't mutate the state.
  const [state, setState] = useState({ count: 0, step: 1 });

  const handleChange = (e) => setState({ ...state, step: e.target.value });
  const inc = () => setState({ ...state, count: state.count + +state.step });
  const dec = () => setState({ ...state, count: state.count - +state.step });
  const res = () => setState({ ...state, count: 0 });

  return (
    <div>
      <div>The current step is {state.step}</div>
      <input type="range" value={state.step} onChange={handleChange} />
      <div>The current count is {state.count}</div>
      <div>
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
        <button onClick={res}>Reset</button>
      </div>
    </div>
  );
};

export default UseState;
