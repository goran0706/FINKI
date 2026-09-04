import PropTypes from "prop-types";

const FunctionComponentProps = (props) => {
  const { greet, message } = props;

  return (
    <div>
      <h1>Props in Class Component</h1>
      <h2>{greet}</h2>
      <p>{message}</p>
    </div>
  );
};

FunctionComponentProps.propTypes = {
  greet: PropTypes.string,
  message: PropTypes.string,
};

FunctionComponentProps.defaultProps = {
  greet: "",
  message: "",
};

export default FunctionComponentProps;
