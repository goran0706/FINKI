import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import {
  Await,
  Link,
  RouterProvider,
  createBrowserRouter,
  defer,
  useLoaderData,
} from "react-router-dom";

const queryClient = new QueryClient();

const Root = () => {
  return (
    <div>
      <h1>Root</h1>
      <div>
        <Link to="/">Root</Link>
        <Link to="/users">Users</Link>
      </div>
    </div>
  );
};

const Users = () => {
  const data = useLoaderData();

  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <Await resolve={data.users}>
        {(users) => {
          return users.data.users.map((u) => <li key={u.id}>{u.name}</li>);
        }}
      </Await>
    </Suspense>
  );
};

const getUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  return defer({ users: data });
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/users",
    element: <Users />,
    // loader: getUsers,
    loader: async () => {
      const existingData = queryClient.getQueryData(["users"]);
      if (existingData) {
        return defer({ users: existingData });
      }
      return defer({
        users: queryClient.fetchQuery({
          queryKey: ["users"],
          queryFn: getUsers,
        }),
      });
    },
  },
]);

const RestfulAPI = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default RestfulAPI;
