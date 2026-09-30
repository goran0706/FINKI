/**
 * Class Component State
 * =====================
 *
 * State in class components is managed via a single `this.state` object on the class instance.
 * Updates are performed using `this.setState()`, which shallowly merges the provided object into the
 * current state and schedules a re-render.
 *
 * Unlike hooks, state setter callbacks can be passed directly to `this.setState(prevState => nextState)`
 * or run after state mutations complete via `this.setState(updater, callback)`. Class state remains tied to
 * the lifecycle and instance methods of the component instance.
 */

import React, { Component } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ClassCounterProps {
  readonly initialCount: number;
}

export interface ClassCounterState {
  readonly count: number;
  readonly lastUpdated: string | null;
}

// ---------------------------------------------------------------------
// 2. Class Component Implementation
// ---------------------------------------------------------------------

export class ClassCounter extends Component<ClassCounterProps, ClassCounterState> {
  constructor(props: ClassCounterProps) {
    super(props);
    this.state = {
      count: props.initialCount,
      lastUpdated: null,
    };
  }

  handleIncrementDirect = (): void => {
    this.setState({
      count: this.state.count + 1,
      lastUpdated: new Date().toLocaleTimeString(),
    });
  };

  handleIncrementFunctional = (): void => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
      lastUpdated: new Date().toLocaleTimeString(),
    }));
  };

  handleReset = (): void => {
    this.setState({
      count: this.props.initialCount,
      lastUpdated: null,
    });
  };

  override render(): React.ReactNode {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <p>Last Updated: {this.state.lastUpdated ?? "Never"}</p>
        <button type="button" onClick={this.handleIncrementDirect}>
          Increment Direct
        </button>
        <button type="button" onClick={this.handleIncrementFunctional}>
          Increment Functional
        </button>
        <button type="button" onClick={this.handleReset}>
          Reset
        </button>
      </div>
    );
  }
}

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ClassComponentStateContainer: React.FC = () => {
  return (
    <div>
      <h1>Class Component State</h1>

      <h2>1. State Initialization and Shallow Merging with setState</h2>
      <ClassCounter initialCount={0} />
    </div>
  );
};

export default ClassComponentStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Class state is stored on a single this.state object attached to the component instance.
// - State updates occur asynchronously using this.setState, which performs shallow object merging.
// - Passing a functional updater to this.setState prevents stale state updates during consecutive calls.
// - An optional callback can be passed as the second argument to this.setState to run post-render logic.
// - Instance properties like state are retained across renders on the single persistent class instance.
