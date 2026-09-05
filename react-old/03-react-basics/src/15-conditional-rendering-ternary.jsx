import PropTypes from "prop-types";

const ConditionalRendering = ({ message }) => {
  // using the ternary operator to render a component
  return message ? <p>{message}</p> : null;
};

ConditionalRendering.propTypes = {
  message: PropTypes.string,
};

export default ConditionalRendering;
