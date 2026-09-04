import PropTypes from "prop-types";

const StatelessComponent = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

StatelessComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

export default StatelessComponent;
