import { Component } from "react";

export class AsyncFetchClass extends Component {
  constructor(props) {
    super(props);
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }

  async componentDidMount() {
    try {
      const url = "https://example.com/data";
      const response = await fetch(url, { signal: this.signal });
      if (!this.signal.aborted) {
        const data = await response.json();
        // Process the data
        console.log(data);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // Request was aborted
        return;
      }
      // Handle other errors
    }
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  render() {
    return <div>Fetch Axios Class</div>;
  }
}
