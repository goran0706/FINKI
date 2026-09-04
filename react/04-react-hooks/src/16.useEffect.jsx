import { useEffect, useState } from "react";

const UseEffect = () => {
  const [users, setUsers] = useState([]);
  const [, setError] = useState(null);
  const [, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("without dependency list");
  });

  useEffect(() => {
    console.log("with empty dependency list");
  }, []);

  useEffect(() => {
    console.log("with dependency list", users);
  }, [users]);

  useEffect(() => {
    console.log("with return callback");
    return () => console.log("cleanup");
  });

  return <div>Async and Side effect using useEffect</div>;
};

export default UseEffect;
