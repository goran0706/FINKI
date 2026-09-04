import { Component } from "react";

export class ClassComponentState extends Component {
  // !Mounting Phase:
  constructor(props) {
    super(props);
    const desc = `constructor(props): This is the constructor method, and it's the first one to be called. You typically initialize state and bind event handlers in this method.`;
    console.log(desc);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // runs during mounting and updating phase
    const desc = `This method is called before rendering when new props are received. It allows you to update the state based on the new props. `;
    console.log(desc, nextProps, prevState);
  }

  componentDidMount() {
    const desc = `This method is called after the component has been rendered to the DOM. It's a good place to perform any initial setup, data fetching, or interact with the DOM.`;
    console.log(desc);
  }

  // !Updating Phase:
  shouldComponentUpdate(nextProps, nextState) {
    const desc = `This method is called before the component re-renders. It provides the opportunity to optimize rendering by determining whether the component should update based on changes in props or state. Returning false from this method will prevent the component from re-rendering.`;
    console.log(desc, nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    const desc = `This method is called after the component has re-rendered due to changes in props or state. It's a good place to perform actions after an update, like data fetching based on new props.`;
    console.log(desc, prevProps, prevState);
  }

  // !Error Handling:
  componentDidCatch(error, info) {
    const desc = `Catches errors in child components.`
    console.log(desc, error, info);
  }

  // !Un-Mounting:
  componentWillUnmount() {
    const desc = `Called just before a component is unmounted and destroyed.`
    console.log(desc);
  }

  render() {
    // runs during mounting and updating phase
    const desc = `The render method is responsible for rendering the component's JSX. It must be a pure function and should not modify the state.  This method is called again to re-render the component with updated props and state. This is a required method.`;
    console.log(desc);

    return (
      <div>
        <h1>Lifecycle Methods in Class Component</h1>
      </div>
    );
  }
}
