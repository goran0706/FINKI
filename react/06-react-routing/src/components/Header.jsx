import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div>React Router</div>
      <nav className="links">
        <Link to="/">Dashboard</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
