import axios from "axios";
import { useEffect, useState } from "react";

/**
 * 
    Why Using Custom Hooks?
    1. Custom hooks provide the best way to create reusable code in a React project (besides components)
    2. Created by extracting hook-related code out of a function component
    3. Custom hooks always make use of at least one primitive hook internally
    4. Each custom hook should have one purpose only
    5. Data-fetching is a great thing to try to make reusable

    Process For Creating Reusable Hooks:
    1. Identify each line of code related to some single purpose
    2. Identify the inputs to that code
    3. Identify the outputs to that code
    4. Extract all of the code into a separate function, receiving the inputs as arguments, and returning the outputs

    2 Rules of Hooks:
    1. Only Call Hooks at the Top Level --> Don’t call Hooks inside loops, conditions, or nested functions.
    2. Only Call Hooks from React Functions --> Don’t call Hooks from regular JavaScript functions.
 */

// Data fetching custom hook - reusable code
const useJsonPlaceholder = (query) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/" + query
      );

      setData(response.data);
    };

    fetchData();
  }, [query]);

  return [data];
};

const CustomHooks = () => {
  const [users] = useJsonPlaceholder("users");

  return (
    <div>
      {users.map(({ id, name, phone }) => (
        <div key={id}>
          <p>{name}</p>
          <p>{phone}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomHooks;
