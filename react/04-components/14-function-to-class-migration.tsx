/**
 * Function-to-Class Migration
 * ===========================
 *
 * Demonstrates refactoring a modern, Hook-driven Functional Component
 * back into a legacy Class Component extending `React.Component<P, S>`.
 *
 * Migration Mapping Key:
 * 1. Functional Scope / `useState` -> Object-oriented `this.state` in constructor/class field.
 * 2. ES6 Parameter Defaults -> `static defaultProps` on the class constructor.
 * 3. Mount Effect `useEffect([], ...)` -> `componentDidMount()`.
 * 4. Dependency Effect `useEffect([count], ...)` -> `componentDidUpdate(prevProps, prevState)` with explicit value comparisons.
 * 5. Cleanup Effect `useEffect(() => cleanup, ...)` -> `componentWillUnmount()`.
 * 6. Inline Scoped Handlers -> Bound class instance methods (ES6 arrow class fields or constructor binding).
 * 7. JSX Function Body -> Explicit `render(): React.ReactNode` lifecycle method.
 */

import React, { Component } from "react";

// ---------------------------------------------------------------------
// 1. Component Props & State Interfaces
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
}

// ---------------------------------------------------------------------
// 2. Migrated Class Component Implementation
// ---------------------------------------------------------------------

export class ClassComponent extends Component<ClassComponentProps, ClassComponentState> {
  // Explicit Display Name for React DevTools and Debugging
  public static override displayName = "ClassComponent";

  // Replaces: ES6 default parameter values in functional props destructuring
  public static defaultProps: Partial<ClassComponentProps> = {
    greet: "Hello",
    message: "Welcome to Class Components",
    initialCount: 0,
    items: ["TypeScript", "React Hooks", "Functional Scope"],
  };

  // =====================================================================
  // SECTION 1: DATA (Constructor & State Initialization)
  // Replaces: Atomic `useState` primitives (`count`, `lastAction`)
  // =====================================================================
  constructor(props: ClassComponentProps) {
    super(props);

    this.state = {
      count: props.initialCount ?? 0,
      lastAction: null,
    };

    console.log("Constructor: Instance state initialized.");
  }

  // =====================================================================
  // SECTION 2: LIFECYCLE HOOKS
  // Replaces: `useEffect` declarative synchronization scopes
  // =====================================================================

  // Replaces: `useEffect(() => { ... }, [])` (Mounting)
  public override componentDidMount(): void {
    console.log("1. [componentDidMount] Executed after initial mount. Replaces mount effect.");
  }

  // Replaces: `useEffect(() => { ... }, [count])` (Dependency Updates)
  public override componentDidUpdate(_prevProps: ClassComponentProps, prevState: ClassComponentState): void {
    console.log("2. [componentDidUpdate] Executed post-render update cycle.");

    // Explicit state check replaces array dependencies `[count]`
    if (prevState.count !== this.state.count) {
      console.log(`3. [Dependency Update Equivalent] Executed due to count change. Current value: ${this.state.count}`);
    }
  }

  // Replaces: `useEffect` return cleanup callbacks
  public override componentWillUnmount(): void {
    console.log("4. [componentWillUnmount] Cleaning up resources prior to unmount. Replaces effect cleanup.");
  }

  // =====================================================================
  // SECTION 3: LOGIC (Event Handlers & State Mutators)
  // Replaces: Scoped functional handlers and `setCount` setters
  // =====================================================================

  // =====================================================================
  public override render(): React.ReactNode {
    console.log("[Render] Evaluating JSX virtual DOM node structure.");

    const { greet, message, items, renderFooter } = this.props;
    const { count, lastAction } = this.state;

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
            <button type="button" onClick={this.handleDecrement}>
              -
            </button>
            <button type="button" onClick={this.handleIncrement}>
              +
            </button>
            <button type="button" onClick={this.handleReset}>
              Reset
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

  // Direct state mutation using `this.setState`
  private handleDecrement = (): void => {
    this.setState({
      count: this.state.count - 1,
      lastAction: "DECREMENT",
    });
  };

  // Functional state updater via `this.setState((prevState) => ...)`
  private handleIncrement = (): void => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
      lastAction: "INCREMENT",
    }));
  };

  // =====================================================================
  // SECTION 4: APPEARANCE (JSX Render Method)
  // Replaces: Functional component return statement

  // Reset handler restoring original props value
  private handleReset = (): void => {
    this.setState({
      count: this.props.initialCount ?? 0,
      lastAction: "RESET",
    });
  };
}

// ---------------------------------------------------------------------
// 3. Demo Container
// ---------------------------------------------------------------------

export class FunctionToClassDemoContainer extends Component {
  public override render(): React.ReactNode {
    return (
      <div>
        <h1>Function-to-Class Component Migration Demonstration</h1>
        <ClassComponent
          greet="Welcome Back"
          message="Migrated class component from function source."
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
// - State Unification: Atomic `useState` variables combined into `this.state` within the class constructor.
// - Default Fallbacks: ES6 parameter defaults replaced by `static defaultProps`.
// - Lifecycle Explicitness: Declarative `useEffect` hooks split across imperative `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` lifecycle methods.
// - Imperative Comparisons: Dependency-driven updates inside `componentDidUpdate` require manual conditional checks (`prevState.count !== this.state.count`).
// - Class Scope Binding: Handlers defined as ES6 arrow fields on the class instance to bind `this` context automatically.
