import PropTypes from "prop-types";

const ConditionalRendering = ({ message }) => {
  // using multiple return statements to render a component
  if (message) {
    return <p>{message}</p>;
  }

  return null;
};

ConditionalRendering.propTypes = {
  message: PropTypes.string,
};

export default ConditionalRendering;
