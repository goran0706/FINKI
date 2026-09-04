import { Link } from "react-router-dom";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const Navbar = styled.nav`
  padding: 1rem;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Navigation = () => {
  return (
    <Header>
      <h1>Navigation</h1>
      <Navbar>
        <NavLinks>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </NavLinks>
      </Navbar>
    </Header>
  );
};

export default Navigation;
