/* 
  Optimistic Update: 
  1. Update the UI
  2. Call the server

  Pessimistic Update:
  1. Call the server
  2. Update the UI

  Optimistic updates can be blazing fast on the UI
*/

const handleAddUser = () => {
  const originalUsers = [...users];
  const newUser = {
    id: users.length + 1,
    name: "John",
    username: "John",
    email: "john@example.com",
  };
  setUsers([newUser, ...users]);
  userService
    .create(newUser)
    .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
    .catch((err) => {
      setError(err.message);
      setUsers(originalUsers);
    });
};

const handleEditUser = (user) => {
  const originalUsers = [...users];
  const editedUser = { ...user, name: user.name + " (updated)" };
  setUsers(users.map((u) => (u.id === user.id ? editedUser : u)));
  userService.update(editedUser).catch((err) => {
    setError(err.message);
    setUsers(originalUsers);
  });
};

const handleDeleteUser = (user) => {
  const originalUsers = [...users];
  setUsers(users.filter((u) => u.id !== user.id));
  userService.delete(user.id).catch((err) => {
    setError(err.message);
    setUsers(originalUsers);
  });
};
