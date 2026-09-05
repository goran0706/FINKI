import PropTypes from "prop-types";

/* 
  - Pure Function - Given the same input, always returns the same output.
  - Pure Component - Given the same props, always returns the same JSX. 
  !Remember: To keep components Pure, keep changes out of the render phase.
  We should not change any object that existed before rendering.
*/

const PureComponent = ({ count }) => {
  return (
    <div>
      <h1>Pure Component</h1>
      <p>{count}</p>
    </div>
  );
};

PureComponent.propTypes = {
  count: PropTypes.number,
};

export default PureComponent;
