/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getTodos = async () => {
  const url = "https://jsonplaceholder.typicode.com/todos";
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const postTodo = async () => {
  const url = "https://jsonplaceholder.typicode.com/todos";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "Learn React",
    }),
  });
  const data = await response.json();
  return data;
};

const ReactQuery = () => {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { isLoading, error, data } = useQuery(["todos"], getTodos);

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("todos");
    },
  });

  const handleAddTodo = () => {
    mutation.mutate({
      id: Date.now(),
      title: "Do Laundry",
    });
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>An error has occurred: {error.message}</p>;

  return (
    <div>
      <h1>ReactQuery</h1>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button className="btn btn-primary" onClick={handleAddTodo}>
        Add Todo
      </button>
    </div>
  );
};

export default ReactQuery;
