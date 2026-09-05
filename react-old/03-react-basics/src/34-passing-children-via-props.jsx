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

const PassingChildrenViaProps = () => {
  const greet = "Hi!";
  const message = "Passing data via props";
  const render = () => (
    <div>
      <h1>Passing Functions Via Props</h1>
      <p>{greet}</p>
      <p>{message}</p>
    </div>
  );

  return (
    // note: nest children, do not pass children via props
    <Greet greet={greet} message={message} render={render}>
      <div>
        <h1>Passing Children Via Props</h1>
        <p>Rendered as a child component</p>
      </div>
    </Greet>
  );
};

export default PassingChildrenViaProps;

/** 
  All React Components can optionally provide these properties:
  - propTypes
  - defaultProps
  - displayName
  - contextTypes
 */
