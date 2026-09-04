import PropTypes from "prop-types";
import { Component } from "react";

export class ClassComponentState extends Component {
  static propTypes = {
    greet: PropTypes.string,
    message: PropTypes.string,
    initialCount: PropTypes.number,
  };

  static defaultProps = {
    greet: "",
    message: "",
    initialCount: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      count: props.initialCount,
    };
  }

  // State Rules in Class Component:
  // 1. State is a JavaScript object that contains data relevant to a component
  // 2. Updating state causes the component to rerender
  // 3. Don't mutate state directly
  // 4. State must be updated using the setState method
  // 5. State in class components can be partially updated, without changing the other properties e.g. {count: 10}
  // 6. Alternate state initialization outside of the component constructor.

  // Binding methods and context (this),
  // 1. bind in constructor
  // 2. bind in render
  // 3. bind in JSX
  // 4. use alternate event handler syntax, instead of binding 'this' we could use an ES6 arrow function () => {}
  decrement = () => this.setState({ count: this.state.count - 1 });
  // decrement = this.decrement.bind(this);

  // The 'setState' works in an asynchronous way.
  // That means after calling 'setState' the 'this.state' variable is not immediately changed.
  // So if we want to perform an action immediately after setting state on a state variable and then return a result, a callback will be useful.
  increment = () => this.setState((state) => ({ count: state.count + 1 }));
  // increment = this.increment.bind(this);

  render() {
    const { props, state, decrement, increment } = this;
    const { greet, message } = props; // this are the props passed down to this component
    const { count } = state; // this is the state this component manages

    return (
      <div>
        <h1>Props in Class Component</h1>
        <h2>{greet}</h2>
        <p>{message}</p>
        <h1>State in Class Component</h1>
        <div>
          <p>Count is: {count}</p>
          <button onClick={decrement}>-</button>
          <button onClick={increment}>+</button>
        </div>
      </div>
    );
  }
}
