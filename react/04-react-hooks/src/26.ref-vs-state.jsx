import { useRef, useState } from "react";

/* 
  Uncontrolled element using the useRef hook to store the element inside the ref.current property

  Pros:
  1. Better performance
  2. Doesn't need to re-render the component when the state changes
  3. Stateless component

  Cons:
  1. More interactions with the DOM
  2. No single source of truth
*/
const UseRef = () => {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted: " + inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
    </form>
  );
};

/* 
  Controlled element using the useState hook to store the value as part of the component state

  Pros:
  1. Single source of truth
  2. Stateful component
  3. Less interactions with the DOM

  Cons:
  1. Might cause performance issues when working with complex forms
  2. Rerenders the component when the state changes (can be optimized for performance)
*/
const UseState = () => {
  const [query, setQuery] = useState(""); // single source of truth

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted: " + query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} value={query} />
    </form>
  );
};

const RefVsStateHook = () => {
  return (
    <div>
      <UseState />
      <UseRef />
    </div>
  );
};

export default RefVsStateHook;
