/* eslint-disable react/prop-types */
import { Fragment, useState } from "react";
import { FaMoon, FaRegMoon, FaSun } from "react-icons/fa";

// dynamically load multiple icons using an object mapping
const iconsMap = {
  1: <FaSun />,
  2: <FaMoon />,
  3: <FaRegMoon />,
};

// Extracting JSX to a separate reusable component
const RandomIcon = ({ icon, onClick }) => (
  <div>
    <h1>Random icon</h1>
    <span>{icon}</span>
    <button onClick={onClick}>Random icon</button>
  </div>
);

const SpecifyingIcons = () => {
  // data
  const [icon, setIcon] = useState(1);

  // logic
  const randomizeIcon = () => Math.floor(Math.random() * 4);
  const handleClick = () => setIcon(randomizeIcon());

  // view
  return (
    <Fragment>
      <h1>Specifying Icons</h1>
      <FaSun />
      <FaMoon />
      <FaRegMoon />
      <RandomIcon icon={iconsMap[icon]} onClick={handleClick} />
    </Fragment>
  );
};

export default SpecifyingIcons;
