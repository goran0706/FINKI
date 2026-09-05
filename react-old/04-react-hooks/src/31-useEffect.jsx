import { useEffect, useState } from "react";

const UseEffect = () => {
  const [, setUsers] = useState([]);
  const [count] = useState(0);

  // 1. Perform side effects
  // 2. Split the effects

  // fetch data when the component first renders
  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const body = await res.json();
      return body;
    };
    getUsers()
      .then((data) => setUsers(data))
      .catch((e) => console.error(e));
  }, []);

  // run on render
  useEffect(() => {
    console.log("Run effects on every render");
  });

  // run once
  useEffect(() => {
    console.log("Run effects once on first render");
  }, []);

  // run when dependency change
  useEffect(() => {
    console.log("Run effects once dependency change");
  }, [count]);

  // run cleanup
  useEffect(() => {
    return () => {
      console.log("Run cleanup function when component dismounts");
    };
  });

  return <div>UseEffect</div>;
};

export default UseEffect;
