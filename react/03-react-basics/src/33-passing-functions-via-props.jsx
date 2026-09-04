import PropTypes from "prop-types";

const Greet = ({ greet, message, render }) => {
  return render(greet, message);
};

Greet.propTypes = {
  greet: PropTypes.string,
  message: PropTypes.string,
  render: PropTypes.func,
};

Greet.defaultProps = {
  greet: "",
  message: "",
  render: (greet, message) => (
    <div>
      <h1>Passing Functions Via Props</h1>
      <p>{greet}</p>
      <p>{message}</p>
    </div>
  ),
};

const PassingFunctionsViaProps = () => {
  const greet = "Hi!";
  const message = "Passing data via props";
  const render = () => (
    <div>
      <h1>Passing Functions Via Props</h1>
      <p>{greet}</p>
      <p>{message}</p>
    </div>
  );

  <Greet greet={greet} message={message} render={render} />;
};

export default PassingFunctionsViaProps;
