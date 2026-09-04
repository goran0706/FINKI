/* eslint-disable react/prop-types */
import { memo, useCallback, useState } from "react";

const UserInput = ({ handleSubmit }) => {
  console.log("component rendered");
  return (
    <form onSubmit={handleSubmit}>
      <h3>Memoized Child Component</h3>
      <input type="text" />
    </form>
  );
};

const MemoizedUserInput = memo(UserInput);

const UseCallbackApp = () => {
  const [value, setValue] = useState("");

  // memo hook used to memoize the UserInput won't work unless we memoize the handleSubmit function between rerenders
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    console.log(`You have entered: ${event.target.elements[0].value}`);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Parent Component</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
      <MemoizedUserInput handleSubmit={handleSubmit} />
    </>
  );
};

export default UseCallbackApp;
