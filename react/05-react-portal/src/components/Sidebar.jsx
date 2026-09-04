import { useState } from "react";
import { createPortal } from "react-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Analytics</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  );
};

const SidebarApp = () => {
  const [show, setShow] = useState();

  return (
    <div>
      <header>Header</header>
      <button onClick={() => setShow((show) => !show)}>Show Sidebar</button>
      {show && createPortal(<Sidebar />, document.body)}
    </div>
  );
};

export default SidebarApp;
