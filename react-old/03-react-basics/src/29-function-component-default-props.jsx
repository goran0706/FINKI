import PropTypes from "prop-types";

const FunctionComponentPropTypes = (props) => {
  const { greet, message, render, items } = props;
  const itemsEl = items.map((i) => <li key={i}>{i}</li>);

  return (
    <div>
      <h1>Props in Class Component</h1>
      <h2>{greet}</h2>
      <p>{message}</p>
      {render}
      <ul>{itemsEl}</ul>
    </div>
  );
};

FunctionComponentPropTypes.propTypes = {
  greet: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  render: PropTypes.func,
  items: PropTypes.array,
};

FunctionComponentPropTypes.defaultProps = {
  greet: "",
  message: "",
  render: () => <p>render function</p>,
  items: [],
};

export default FunctionComponentPropTypes;
