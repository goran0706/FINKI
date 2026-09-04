// Handling Errors:
// 1. Error Boundaries
// 2. Handling Async Errors
// 3. Global Error Handling
// 4. Error Reporting Services
// 5. Conditional Rendering

import { Component, useEffect } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // You can log the error or send it to a tracking service here
    console.log(error, info);
    console.log("send to error handling service");
  }

  render() {
    // Conditional Rendering
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    }

    // Render your component content here
    return <div>Hello World!</div>;
  }
}

export const HandlingAsyncErrors = () => {};

export const GlobalErrorHandling = () => {
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      // Handle global errors, e.g., log to a server
      console.error("Global Error:", message, source, lineno, colno, error);
    };
  });

  return <div>Global Error Handling</div>;
};
