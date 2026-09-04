import {
  Link,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="*"
      element={
        <div>
          <Navigation />
          <Outlet />
        </div>
      }
    >
      <Route path="home" element={<Home />} />
      <Route path="users" element={<Users />} />
      <Route path="about" element={<About />}>
        <Route path="career" element={<Career />} />
        <Route path="jobs" element={<Jobs />} />
      </Route>
    </Route>
  )
);

const RouterV6Migration = () => {
  return <RouterProvider router={router} />;
};

export default RouterV6Migration;
