import PropTypes from "prop-types";

const Child = ({ greet }) => {
  return (
    <div>
      <h1>Parent To Child Communication</h1>
      <p>{greet}</p>
    </div>
  );
};

Child.propTypes = {
  greet: PropTypes.string.isRequired,
};

const Parent = () => {
  return <Child greet="Hello!" />;
};

export default Parent;
