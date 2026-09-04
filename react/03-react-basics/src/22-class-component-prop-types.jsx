import PropTypes from "prop-types";
import { Component } from "react";

class ClassComponentPropTypes extends Component {
  static propTypes = {
    greet: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    render: PropTypes.func,
    items: PropTypes.array,
  };

  render() {
    const { greet, message, render, items } = this.props;
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
  }
}

export default ClassComponentPropTypes;
