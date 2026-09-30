/**
 * Function Components
 * ===================
 *
 * Function components are JavaScript functions that accept props and return JSX element
 * descriptors, serving as the primary functional building block of modern React applications.
 * They execute declarative transformations mapping input properties and local state directly to
 * virtual DOM element trees for every render cycle.
 *
 * Given identical inputs, function components evaluate as pure transformations of data into JSX
 * without mutating external variables. Read-only TypeScript interfaces enforce explicit prop typing
 * and fallback handling across composition boundaries, while the `useState` and `useEffect` hooks
 * manage local state scopes and Effect behavior natively. Unlike class state shallow merging,
 * functional state updates require explicit primitive replacement or immutability patterns.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Component Props Interface
// ---------------------------------------------------------------------

export interface FunctionComponentProps {
  readonly greet?: string;
  readonly message?: string;
  readonly initialCount?: number;
  readonly items?: ReadonlyArray<string>;
  readonly renderFooter?: React.ReactNode;
}

// ---------------------------------------------------------------------
// 2. Integrated Function Component Implementation
// ---------------------------------------------------------------------

export const FunctionComponent: React.FC<FunctionComponentProps> = (props) => {
  const {
    greet = "Hello",
    message = "Welcome to Function Components",
    initialCount = 0,
    items = ["TypeScript", "React Hooks", "Functional Scope"],
    renderFooter,
  } = props;

  // ---------------------------------------------------------------------
  // State Rules & Immutability in Function Components:
  // 1. Unlike class `this.setState`, `useState` setters replace state entirely
  //    rather than performing automatic shallow object merging.
  // 2. Updating state triggers component re-execution and reconciliation.
  // 3. Never mutate state variables directly; always use setter functions.
  // 4. Immutability guidelines across data types:
  //    - Primitives: Replace directly or use functional updaters `setCount(prev => prev + 1)`.
  //    - Objects: Copy via shallow spread before overriding properties `{ ...prev, key: value }`.
  //    - Arrays: Return new array references using spread `[...prev]`, `.filter()`, or `.concat()`.
  //    - Array of Objects: Transform immutably via `.map()` to update specific element properties.
  // ---------------------------------------------------------------------
  const [count, setCount] = useState<number>(initialCount);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // ---------------------------------------------------------------------
  // useEffect Execution Model:
  // 1. Render the component.
  // 2. React commits the rendered output to the DOM.
  // 3. Effects are executed after the commit.
  // 4. Effects without dependencies run after every commit.
  // 5. Effects with `[]` do not re-run because of dependency changes.
  // 6. Effects with `[dependencies]` re-run when a dependency changes.
  // 7. Before an Effect re-runs, React executes its previous cleanup.
  // 8. When the component unmounts, React executes the final cleanup.
  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // 1. Effect without a Dependency Array
  // ---------------------------------------------------------------------

  // Runs after every completed render, including the initial render.
  // It runs again after every subsequent render, regardless of which state or
  // prop caused the render.
  useEffect(() => {
    console.log("[Effect] Runs after every completed render.");
  });

  // ---------------------------------------------------------------------
  // 2. Effect with an Empty Dependency Array
  // ---------------------------------------------------------------------

  // Runs after the initial render and does not re-run because of later
  // prop or state changes. In development Strict Mode, React may run the
  // setup and cleanup an extra time to verify that the Effect is resilient.
  useEffect(() => {
    console.log("[Effect] Runs after the initial render.");
  }, []);

  // ---------------------------------------------------------------------
  // 3. Effect with Specific Dependencies
  // ---------------------------------------------------------------------

  // Runs after the initial render and again after a completed render when
  // `count` has changed since the Effect's previous execution.
  useEffect(() => {
    console.log(`[Effect] Runs when count changes: ${count}`);
  }, [count]);

  // ---------------------------------------------------------------------
  // 4. Effect Setup and Cleanup
  // ---------------------------------------------------------------------

  // Runs after the initial render and whenever `count` changes.
  // Before the Effect runs again because `count` changed, React first runs
  // the previous cleanup. React also runs the cleanup when the component unmounts.
  useEffect(() => {
    console.log(`[Setup] Subscribing with count: ${count}`);

    return () => {
      console.log(`[Cleanup] Cleaning up count: ${count}`);
    };
  }, [count]);

  // ---------------------------------------------------------------------
  // State Handlers & Updater Demonstrations
  // ---------------------------------------------------------------------

  // Direct Primitive Replacement
  const decrement = (): void => {
    setCount(count - 1);
    setLastAction("DECREMENT");
  };

  // Functional State Update (Prevents race conditions from batched updates)
  const increment = (): void => {
    setCount((prevCount) => prevCount + 1);
    setLastAction("INCREMENT");
  };

  // Reset Handler
  const handleReset = (): void => {
    setCount(initialCount);
    setLastAction("RESET");
  };

  // ---------------------------------------------------------------------
  // Render Phase (JSX Virtual DOM Declaration)
  // ---------------------------------------------------------------------
  console.log("[Render] Evaluating JSX virtual DOM node structure.");

  return (
    <div className="function-component-card">
      <header className="component-header">
        <h1>Props in Function Component</h1>
        <h2>{greet}</h2>
        <p>{message}</p>
      </header>

      <section className="state-controls">
        <h1>State in Function Component</h1>
        <p>Count is: {count}</p>
        {lastAction && <p>Last Action: {lastAction}</p>}
        <div className="button-group">
          <button type="button" onClick={decrement}>
            -
          </button>
          <button type="button" onClick={increment}>
            +
          </button>
          <button type="button" onClick={handleReset}>
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
};

// Explicit Display Name for React DevTools and Debugging
FunctionComponent.displayName = "FunctionComponent";

// ---------------------------------------------------------------------
// 3. Demo Container
// ---------------------------------------------------------------------

export function FunctionComponentsDemoContainer(): JSX.Element {
  return (
    <div>
      <h1>Function Components Architecture Demonstration</h1>
      <FunctionComponent
        greet="Welcome Back"
        message="Fully integrated function component demonstration."
        initialCount={10}
        items={["TypeScript", "React Hooks", "Functional Scope"]}
      />
    </div>
  );
}

export default FunctionComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Function components map input props and local hook state directly to declarative JSX output.
// - Static `displayName` explicitly sets the identity tag for React DevTools and stack traces.
// - Default parameter values provide property fallbacks without requiring legacy `defaultProps`.
// - `useState` updates state immutably by replacing values rather than shallow object merging.
// - Functional state updaters `(prev) => next` prevent race conditions during batched updates.
// - `useEffect` runs after commits according to its dependency array and can return cleanup logic
//   that runs before re-execution and when the component unmounts.
// - Function components eliminate `this` context binding overhead inherent to object-oriented structures.
