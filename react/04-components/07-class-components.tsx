/**
 * Class Components
 * ================
 *
 * Class components represent the object-oriented paradigm in React, extending `React.Component`
 * to manage persistent instance state, method contexts, static metadata, and structured lifecycle hooks.
 * Class instances maintain state in memory across renders, retaining local memory (`this.state`) and
 * instance method bindings, while batching asynchronous partial updates via `this.setState()`.
 *
 * Static fields attach metadata directly to constructor functions for fallback values, DevTools
 * identification, and configuration. Explicit method context bindings ensure proper resolution of
 * `this` through constructor bindings or arrow class fields, while typed generic parameters strictly
 * map incoming props and component state at compile time across distinct lifecycle phases.
 */

import React, { Component, ErrorInfo } from "react";

// ---------------------------------------------------------------------
// 1. Component Props and State Interfaces
// ---------------------------------------------------------------------

export interface ClassComponentProps {
  readonly greet?: string;
  readonly message?: string;
  readonly initialCount?: number;
  readonly items?: ReadonlyArray<string>;
  readonly renderFooter?: React.ReactNode;
}

export interface ClassComponentState {
  readonly count: number;
  readonly lastAction: string | null;
  readonly hasError: boolean;
}

// ---------------------------------------------------------------------
// 2. Integrated Class Component Implementation
// ---------------------------------------------------------------------

export class ClassComponent extends Component<ClassComponentProps, ClassComponentState> {
  // Explicit Display Name for React DevTools and Debugging
  public static override displayName = "ClassComponent";

  // Static default property fallbacks
  public static defaultProps: Partial<ClassComponentProps> = {
    greet: "Hello",
    message: "Welcome to Class Components",
    initialCount: 0,
    items: ["Alpha", "Beta", "Gamma"],
  };

  // State Rules in Class Component (Alternate Initialization):
  // 6. Alternate state initialization outside the component constructor as a class field.
  // public state: ClassComponentState = {
  //     count: this.props.initialCount ?? 0,
  //     lastAction: null,
  //     hasError: false,
  // };

  // ---------------------------------------------------------------------
  // Lifecycle - Mounting Phase: Constructor Initialization
  // ---------------------------------------------------------------------
  constructor(props: ClassComponentProps) {
    super(props);

    // State Rules in Class Component:
    // 1. State is a JavaScript object that contains data relevant to a component.
    // 2. Updating state causes the component to rerender.
    // 3. Don't mutate state directly (e.g. `this.state.count = 10` is illegal).
    // 4. State must be updated using the `this.setState()` method.
    // 5. State in class components can be partially updated, without changing the other properties e.g. { count: 10 }.
    // 6. Alternate state initialization outside the component constructor.
    this.state = {
      count: props.initialCount ?? 0,
      lastAction: null,
      hasError: false,
    };

    // Binding methods and context (this):
    // 1. bind in constructor
    this.handleReset = this.handleReset.bind(this);
    this.decrementExplicitBind = this.decrementExplicitBind.bind(this);

    console.log("1. constructor(props): Initialized instance state and context bindings.");
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Mounting & Updating Phase: Static Derived State
  // ---------------------------------------------------------------------
  public static getDerivedStateFromProps(
    nextProps: ClassComponentProps,
    prevState: ClassComponentState,
  ): Partial<ClassComponentState> | null {
    console.log(
      "2. getDerivedStateFromProps(nextProps, prevState): Syncing state with props if needed.",
      nextProps,
      prevState,
    );
    return null;
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Mounting Phase: Component Did Mount

  // ---------------------------------------------------------------------
  public static getDerivedStateFromError(error: Error): Partial<ClassComponentState> {
    console.log("getDerivedStateFromError: Updating fallback state on error.", error);
    return { hasError: true };
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Updating Phase: Should Component Update

  // ---------------------------------------------------------------------
  public override componentDidMount(): void {
    console.log(
      "3. componentDidMount(): Executed post-mount. Ideal for network requests, subscriptions, and DOM access.",
    );
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Updating Phase: Component Did Update

  // ---------------------------------------------------------------------
  public override shouldComponentUpdate(nextProps: ClassComponentProps, nextState: ClassComponentState): boolean {
    console.log(
      "4. shouldComponentUpdate(nextProps, nextState): Determining re-render necessity.",
      nextProps,
      nextState,
    );
    return true;
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Error Handling Phase: Error Boundaries

  // ---------------------------------------------------------------------
  public override componentDidUpdate(prevProps: ClassComponentProps, prevState: ClassComponentState): void {
    console.log("5. componentDidUpdate(prevProps, prevState): Executed post-DOM update.", prevProps, prevState);
  }

  public override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.log("6. componentDidCatch(error, info): Capturing stack traces for logging.", error, info);
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Unmounting Phase: Component Will Unmount
  // ---------------------------------------------------------------------
  public override componentWillUnmount(): void {
    console.log("7. componentWillUnmount(): Cleaning up timers, network requests, and event listeners.");
  }

  // ---------------------------------------------------------------------
  // Binding methods and context (this):
  // 1. bind in constructor
  // 2. bind in render
  // 3. bind in JSX
  // 4. use alternate event handler syntax, instead of binding 'this' we could use an ES6 arrow function () => {}
  // ---------------------------------------------------------------------

  // Binding Strategy 1: Explicit binding in constructor
  public decrementExplicitBind(): void {
    this.setState({
      count: this.state.count - 1,
      lastAction: "DECREMENT_CONSTRUCTOR_BIND",
    });
  }

  // Binding Strategy 4: ES6 arrow function class field (Autobound)
  public decrement = (): void => {
    this.setState({
      count: this.state.count - 1,
      lastAction: "DECREMENT_ARROW_FIELD",
    });
  };

  // The 'setState' works in an asynchronous way.
  // That means after calling 'setState' the 'this.state' variable is not immediately changed.
  // So if we want to perform an action immediately after setting state on a state variable and then return a result, a callback will be useful.
  public increment = (): void => {
    this.setState(
      (state) => ({
        count: state.count + 1,
        lastAction: "INCREMENT_CALLBACK",
      }),
      () => {
        console.log(`[setState Callback] Immediate post-update count is: ${this.state.count}`);
      },
    );
  };

  public handleReset(): void {
    this.setState({
      count: this.props.initialCount ?? 0,
      lastAction: "RESET",
    });
  }

  // ---------------------------------------------------------------------
  // Lifecycle - Render Phase (Required Method)
  // ---------------------------------------------------------------------
  public override render(): React.ReactNode {
    console.log("render(): Evaluating JSX virtual DOM node structure.");

    if (this.state.hasError) {
      return <div className="error-fallback">An unexpected UI error occurred.</div>;
    }

    const { props, state, decrement, increment } = this;
    const { greet, message, items, renderFooter } = props;
    const { count, lastAction } = state;

    return (
      <div className="class-component-card">
        <header className="component-header">
          <h1>Props in Class Component</h1>
          <h2>{greet}</h2>
          <p>{message}</p>
        </header>

        <section className="state-controls">
          <h1>State in Class Component</h1>
          <p>Count is: {count}</p>
          {lastAction && <p>Last Action: {lastAction}</p>}
          <div className="button-group">
            {/* 4. Alternate ES6 arrow function class field */}
            <button type="button" onClick={decrement}>
              - (Arrow Field)
            </button>

            {/* 1. Explicitly bound in constructor */}
            <button type="button" onClick={this.decrementExplicitBind}>
              - (Constructor Bound)
            </button>

            {/* 2. Bind in render */}
            <button type="button" onClick={this.handleReset.bind(this)}>
              Reset (Bind in Render)
            </button>

            {/* 3. Bind in JSX inline arrow function */}
            <button type="button" onClick={() => increment()}>
              + (Inline Arrow JSX)
            </button>
          </div>
        </section>

        {items && items.length > 0 && (
          <section className="items-list">
            <h3>Rendered Array Items</h3>
            <ul>
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {renderFooter && <footer className="component-footer">{renderFooter}</footer>}
      </div>
    );
  }
}

// ---------------------------------------------------------------------
// 3. Demo Container
// ---------------------------------------------------------------------

export class ClassComponentsDemoContainer extends Component {
  public override render(): React.ReactNode {
    return (
      <div>
        <h1>Class Components Architecture Demonstration</h1>
        <ClassComponent
          greet="Welcome Back"
          message="Fully integrated class component demonstration."
          initialCount={10}
          items={["TypeScript", "Class Lifecycle", "State Binding"]}
        />
      </div>
    );
  }
}

export default ClassComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Class components extend `React.Component<P, S>` to manage local state, lifecycle hooks, and context.
// - Static `displayName` explicitly assigns DevTools identification tags to the component class constructor.
// - State in class components is a persistent object updated via `this.setState()`, supporting partial shallow merging.
// - Context (`this`) binding strategies include constructor `.bind()`, render `.bind()`, inline JSX arrows, and ES6 class fields.
// - `setState` executes asynchronously; state updater functions `(state) => newState` and post-update callbacks handle async sequencing.
// - Structured lifecycle hooks provide explicit entry points across Mounting, Updating, Unmounting, and Error Catching phases.
// - Class instances preserve state in memory between renders until the component is explicitly unmounted.
