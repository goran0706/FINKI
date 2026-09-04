import PropTypes from "prop-types";

const Greet = ({ greet, message }) => {
  return (
    <div>
      <h1>Passing Data Via Props</h1>
      <p>{greet}</p>
      <p>{message}</p>
    </div>
  );
};

Greet.propTypes = {
  greet: PropTypes.string,
  message: PropTypes.string,
};

Greet.defaultProps = {
  greet: "",
  message: "",
};

const PassingDataViaProps = () => (
  <Greet greet="Hi!" message="Passing data via props" />
);

export default PassingDataViaProps;
