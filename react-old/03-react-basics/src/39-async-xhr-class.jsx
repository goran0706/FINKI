import { Component } from "react";

export class AsyncXhrClass extends Component {
  constructor(props) {
    super(props);
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }

  async componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://example.com/data", true);
    xhr.signal = this.signal;

    xhr.onload = () => {
      if (!this.signal.aborted) {
        // Process the response
      }
    };

    xhr.send();
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  render() {
    return <div>Async XHR Class</div>;
  }
}
