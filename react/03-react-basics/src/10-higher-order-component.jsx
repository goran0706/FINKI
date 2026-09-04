import PropTypes from "prop-types";

/* 
  Higher-order component is a function that takes a component and returns a new component.

  Steps:
  1. Write the logic you want to reuse into a component
  2. Create a HOC file and add the HOC scaffold
  3. Move the reusable logic into the HOC
  4. Pass props/config/behavior through to child component
*/

// Reusable component logic
const Component = ({ title }) => <p>{title}</p>;
Component.propTypes = { title: PropTypes.string };

// Higher Order Component
const higherOrderComponent = (Comp, title) => <Comp title={title} />;

// New Enhanced Component
const EnhancedComponent = () => higherOrderComponent(Component, "Title");

export default EnhancedComponent;
