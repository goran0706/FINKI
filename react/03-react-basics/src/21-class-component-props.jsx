import PropTypes from "prop-types";
import { Component } from "react";

export class ClassComponentProps extends Component {
  static propTypes = {
    greet: PropTypes.string,
    message: PropTypes.string,
  };

  static defaultProps = {
    greet: "",
    message: "",
  };

  render() {
    const { greet, message } = this.props;
    return (
      <div>
        <h1>Props in Class Component</h1>
        <h2>{greet}</h2>
        <p>{message}</p>
      </div>
    );
  }
}
