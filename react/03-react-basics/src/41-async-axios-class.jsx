import axios from "axios";
import { Component } from "react";

export class AsyncAxiosClass extends Component {
  constructor(props) {
    super(props);
    this.source = axios.CancelToken.source();
  }

  async componentDidMount() {
    try {
      const url = "https://example.com/data";
      const response = await axios.get(url, { cancelToken: this.source.token });
      // Process the response
      console.log(response);
    } catch (error) {
      if (axios.isCancel(error)) {
        // Request was canceled
        return;
      }
      // Handle other errors
    }
  }

  componentWillUnmount() {
    this.source.cancel("Request canceled by component unmount.");
  }

  render() {
    return <div>Async Axios Class</div>;
  }
}
