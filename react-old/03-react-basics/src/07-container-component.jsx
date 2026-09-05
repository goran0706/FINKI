/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const UserList = ({ users }) => {
  const usersEl = users.map((user) => <li>{user.name}</li>);
  return <ul>{usersEl}</ul>;
};

/* 
  Container component is a common React pattern.
  The basic idea is that the container does the work to get the data, and then passes it as properties to the component responsible for rendering visual elements.
  Containers are an important concept in React applications, as they help to separate the work of getting data and using data to render markup.
  1. The job of this component is to fetch data and to set its state.
  2. The state of the container is passed to the child component as properties.
*/
const ContainerComponent = () => {
  const [users, setUsers] = useState([]);

  // 1. The job of this component is to fetch data and to set its state.
  useEffect(() => {
    const fetchUsers = async () => {
      const url = "https://jsonplaceholder.typicode.com/users";
      const res = await fetch(url);
      const data = await res.json();
      return data;
    };

    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.log(err));
  }, []);

  // 2. The state of the container is passed to the child component as properties.
  return (
    <div>
      <p>ContainerComponent</p>
      <UserList users={users} />
    </div>
  );
};

export default ContainerComponent;
