import { useEffect } from "react";
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import Navigation from "./Navigation";

const Page = styled.div`
  color: white;
  background-color: #222;
  border: 2px solid gray;
  border-radius: 6px;
  width: 640px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Home = () => (
  <Page>
    <Title>Home</Title>
  </Page>
);

const Users = () => (
  <Page>
    <Title>Users</Title>
  </Page>
);

const User = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams((params) => {
      params.set("user", userId || "1");
      return params;
    });
  }, [setSearchParams, userId]);

  const navigate = useNavigate();

  return (
    <Page>
      <Title>User: {userId}</Title>
      <input type="text" defaultValue={searchParams.get("search") ?? ""} />
      <button onClick={() => navigate("/users")}>Go Back</button>
    </Page>
  );
};

const About = () => (
  <Page>
    <Title>About</Title>
    <NavLinks>
      <Link to="career">Career</Link>
      <Link to="jobs">Jobs</Link>
    </NavLinks>
    <Outlet />
  </Page>
);

const Career = () => <Page>Career</Page>;

const Jobs = () => <Page>Jobs</Page>;

const ErrorPage = () => <Page>ErrorPage</Page>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navigation />
        <Outlet />
      </div>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "users/:userId",
        element: <User />,
      },
      {
        path: "about",
        element: <About />,
        children: [
          {
            path: "career",
            element: <Career />,
          },
          {
            path: "jobs",
            element: <Jobs />,
          },
        ],
      },
    ],
  },
]);

const RouterV6 = () => {
  return <RouterProvider router={router} />;
};

export default RouterV6;
