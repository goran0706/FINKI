import { useEffect, useState } from "react";

const useFetch = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // With automatic batching, React will automatically batch any state updates that happen within the same event loop tick.
  // This means that state updates that happen inside timeouts, promises, native event handlers or any other events will be batched
  // the same way as state updates inside React events.
  const fetchData = async () => {
    setIsLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setIsError(false);
      })
      .catch((err) => {
        setError(err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, isError, isLoading };
};

const UseState = () => {
  const { data: users, error, isError, isLoading } = useFetch();
  const results = users.length;
  return (
    <div>
      <div>Results: {results}</div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Caught error: {error.message}</p>}
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </div>
  );
};

export default UseState;
