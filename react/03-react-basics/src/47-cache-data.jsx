import { useEffect, useState } from "react";

const cache = {};

const CacheData = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const url = "https://example.com/data";
        const response = await fetch(url, { signal: controller.signal });
        if (!controller.signal.aborted) {
          const data = await response.json();
          // Process the data
          console.log(data);
          cache.users = data || [];
          setUsers(cache.users);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          // Request was aborted
          return;
        }
        // Handle other errors
      }
    };

    // get cached data or fetch
    cache.users?.length > 0 ? setUsers(cache.users) : fetchUsers();

    return () => {
      controller.abort;
    };
  }, []);

  return (
    <div>
      <h1>Async Fetch Function</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CacheData;
