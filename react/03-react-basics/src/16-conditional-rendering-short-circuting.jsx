import PropTypes from "prop-types";

const ConditionalRendering = ({ message }) => {
  // using the short circuiting to render a component
  return message && <p>{message}</p>;
};

ConditionalRendering.propTypes = {
  message: PropTypes.string,
};

export default ConditionalRendering;
