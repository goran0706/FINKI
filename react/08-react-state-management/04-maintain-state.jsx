import React, { useEffect, useState } from "react";

const MaintainState = () => {
  // initial state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // optimize cleanup
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    // fetching component data
    const fetchUsers = async () => {
      const url = "https://jsonplaceholder.typicode.com/users";
      const res = await fetch(url);
      const data = await res.json();
      return data;
    };

    // updating state
    fetchUsers()
      .then((data) => {
        setUsers(data[0]);
      })
      .catch((err) => {
        console.log(controller.signal.aborted);
        setError(err.message ? err.message : err);
      })
      .finally(() => {
        setLoading(false);
        setResolved(true);
      });

    // canceling request
    return () => controller.abort();
  }, [resolved]);

  return (
    <div>
      <h2>MaintainState</h2>
      {loading ? <p>Loading...</p> : users.map((u) => <li>{u.name}</li>)}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default MaintainState;
