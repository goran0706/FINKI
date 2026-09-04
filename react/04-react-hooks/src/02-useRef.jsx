import { useRef } from "react";

const UseRef = () => {
  // 1. Reference a value that’s not needed for rendering.
  // 2. Can also be used to remember the value between rerenders
  // 3. Preferred when no state updates are needed
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert("You clicked " + ref.current + " times!");
  }

  return <button onClick={handleClick}>Click me!</button>;
};

export default UseRef;
