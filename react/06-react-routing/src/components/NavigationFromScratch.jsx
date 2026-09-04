/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const Link = ({ path, children, ...rest }) => {
  const handleClick = (e) => {
    // allow links default behavior
    if (e.metaKey || e.ctrlKey) {
      return;
    }

    // prevent links default behavior, change pathname and emit popstate event
    e.preventDefault();
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    // regular link with href wont work we need to prevent the default link behavior
    <a onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

const Route = ({ path, element }) => {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    // 1. subscribe to popstate event emitted by clicking on navigation links
    // 2. read the new location.pathname
    // 3. update the current path state in order to trigger component rerender
    // 4. render the component only if the paths are matching
    const onLocationChange = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", onLocationChange);

    // clean up
    return () => window.removeEventListener("popstate", onLocationChange);
  }, [path]);

  return pathname === path ? element : null;
};

const Navbar = () => {
  return (
    <header className="d-flex">
      <div>Navigation</div>
      <nav>
        <Link path="/">Home</Link>
        <Link path="/about">About</Link>
        <Link path="/contact">Contact</Link>
      </nav>
    </header>
  );
};

const Navigation = () => {
  return (
    <>
      <Navbar />
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/about" element={<h1>About</h1>} />
      <Route path="/contact" element={<h1>Contact</h1>} />
    </>
  );
};

export default Navigation;
