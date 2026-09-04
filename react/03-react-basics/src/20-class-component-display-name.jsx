import { Component } from "react";

export class ClassComponentDisplayName extends Component {
  static displayName = "MyComponent";

  render() {
    return <div>My Component Content</div>;
  }
}
