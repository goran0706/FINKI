/**
 * Class-to-Function Migration
 * ===========================
 *
 * Demonstrates the step-by-step refactoring of the legacy `ClassComponent`
 * into a modern, idiomatic Functional Component using React Hooks.
 *
 * Migration Mapping Key:
 * 1. `React.Component<P, S>` -> `React.FC<P>` (or standard typed function).
 * 2. `this.state` object -> Atomic `useState` hooks.
 * 3. `static defaultProps` -> ES6 default parameter destructuring.
 * 4. `componentDidMount` & `componentWillUnmount` -> `useEffect` with an empty dependency array `[]`.
 * 5. `componentDidUpdate` -> `useEffect` with specific state/prop dependencies (and a `useRef` for initial mount skipping).
 * 6. `setState` callbacks -> Post-update synchronization via `useEffect`.
 * 7. Method context binding (`this.bind` / class fields) -> Lexically scoped inline functions or `useCallback`.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Props Interface (Preserved Contract)
// ---------------------------------------------------------------------

export interface FunctionComponentProps {
  readonly greet?: string;
  readonly message?: string;
  readonly initialCount?: number;
  readonly items?: ReadonlyArray<string>;
  readonly renderFooter?: React.ReactNode;
}

// ---------------------------------------------------------------------
// 2. Refactored Functional Component Implementation
// ---------------------------------------------------------------------

export const FunctionComponent: React.FC<FunctionComponentProps> = (props) => {
  // =====================================================================
  // SECTION 1: DATA & DEFAULTS
  // Replaces: `static defaultProps` & constructor property access
  // =====================================================================
  const {
    greet = "Hello",
    message = "Welcome to Functional Components",
    initialCount = 0,
    items = ["Alpha", "Beta", "Gamma"],
    renderFooter,
  } = props;

  // Replaces: `this.state = { count, lastAction, hasError }`
  const [count, setCount] = useState<number>(initialCount);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [hasError] = useState<boolean>(false);

  // Ref to track initial render (replicates `componentDidUpdate` non-mount execution)
  const isInitialMount = useRef<boolean>(true);

  // =====================================================================
  // SECTION 2: LIFECYCLE HOOKS & SIDE EFFECTS
  // =====================================================================

  // Replaces: `componentDidMount` & `componentWillUnmount`
  useEffect(() => {
    console.log("3. componentDidMount() Equivalent: Functional component mounted.");

    return () => {
      console.log("7. componentWillUnmount() Equivalent: Executing cleanup on unmount.");
    };
  }, []);

  // Replaces: `componentDidUpdate`
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    console.log("5. componentDidUpdate() Equivalent: Executed post-DOM update.", { count, lastAction });
  }, [count, lastAction]);

  // Replaces: `setState` post-update callback for `increment`
  useEffect(() => {
    if (lastAction === "INCREMENT_CALLBACK") {
      console.log(`[useState Post-Update Effect] Immediate count after increment is: ${count}`);
    }
  }, [count, lastAction]);

  // =====================================================================
  // SECTION 3: EVENT HANDLERS & STATE MUTATORS
  // Replaces: Class methods, constructor `.bind()`, and ES6 class fields
  // =====================================================================

  // Replaces constructor binding & arrow field decrements
  const handleDecrement = useCallback((actionSource: string) => {
    setCount((prevCount) => prevCount - 1);
    setLastAction(actionSource);
  }, []);

  // Replaces `increment` with `this.setState(updater, callback)`
  const handleIncrement = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
    setLastAction("INCREMENT_CALLBACK");
  }, []);

  // Replaces `handleReset`
  const handleReset = useCallback(() => {
    setCount(initialCount);
    setLastAction("RESET");
  }, [initialCount]);

  // =====================================================================
  // SECTION 4: APPEARANCE (JSX Output)
  // Replaces: Class `render()` method
  // =====================================================================
  if (hasError) {
    return <div className="error-fallback">An unexpected UI error occurred.</div>;
  }

  return (
    <div className="function-component-card">
      <header className="component-header">
        <h1>Props in Functional Component</h1>
        <h2>{greet}</h2>
        <p>{message}</p>
      </header>

      <section className="state-controls">
        <h1>State in Functional Component</h1>
        <p>Count is: {count}</p>
        {lastAction && <p>Last Action: {lastAction}</p>}
        <div className="button-group">
          <button type="button" onClick={() => handleDecrement("DECREMENT_SCOPED_FUNC")}>
            - (Scoped Function)
          </button>

          <button type="button" onClick={() => handleDecrement("DECREMENT_CALLBACK")}>
            - (useCallback)
          </button>

          <button type="button" onClick={handleReset}>
            Reset (useCallback)
          </button>

          <button type="button" onClick={handleIncrement}>
            + (useCallback + Effect)
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
};

FunctionComponent.displayName = "FunctionComponent";

// ---------------------------------------------------------------------
// 3. Refactored Demo Container
// ---------------------------------------------------------------------

export const FunctionComponentsDemoContainer: React.FC = () => {
  return (
    <div>
      <h1>Functional Components Architecture Demonstration</h1>
      <FunctionComponent
        greet="Welcome Back"
        message="Fully migrated functional component demonstration."
        initialCount={10}
        items={["TypeScript", "React Hooks", "State & Effects"]}
      />
    </div>
  );
};

export default FunctionComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Object State vs Atomic Hooks: Unified `this.state` broken into atomic `useState` primitives.
// - Default Fallbacks: Replaced static `defaultProps` with ES6 default parameter assignments.
// - Lifecycle Consolidation: Replaced constructor, `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` with `useEffect` and `useRef`.
// - Explicit Callback Sequencing: Replaced `setState` post-update callbacks with targeted `useEffect` dependencies.
// - Scope-based Event Handlers: Eliminated manual `.bind(this)` operations in favor of standard lexically scoped functions and `useCallback`.
