import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./components/About";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";

const App = () => {
  return (
    <div className="AppContainer">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />}>
              <Route path="messages" element={<h2>messages</h2>} />
              <Route path="tasks" element={<h2>tasks</h2>} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
