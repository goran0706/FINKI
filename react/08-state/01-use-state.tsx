/**
 * useState
 * ========
 *
 * `useState` is a React Hook that lets you add a state variable to a component. Calling `useState` returns
 * an array with exactly two values: the current state during this render, and a set function that lets
 * you update the state to something else and trigger React to render the component again.
 *
 * When a component re-renders, React executes the component function from scratch. State is stored outside
 * the function by React, associated with the component's position in the UI tree. Passing an updater function
 * `prev => next` to the set function ensures state updates rely on the latest pending state. If the next state
 * provided to a set function is identical to the current state using the `Object.is` algorithm, React skips
 * re-rendering the component and its children.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicStateProps {
  readonly initialCount: number;
}

export interface FunctionalStateProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicState: React.FC<BasicStateProps> = ({ initialCount }) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleIncrement = (): void => {
    setCount(count + 1);
  };

  const handleReset = (): void => {
    setCount(initialCount);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export const FunctionalState: React.FC<FunctionalStateProps> = ({ initialValue }) => {
  const [text, setText] = useState<string>(initialValue);

  const handleAsyncUpdate = (): void => {
    setTimeout(() => {
      setText((prevText: string) => `${prevText} [Updated]`);
    }, 1000);
  };

  return (
    <div>
      <p>Text: {text}</p>
      <button type="button" onClick={handleAsyncUpdate}>
        Delayed Functional Update
      </button>
    </div>
  );
};

export const MultipleStateHooks: React.FC = () => {
  const [flag, setFlag] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const handleToggleAndAdvance = (): void => {
    setFlag((prev: boolean) => !prev);
    setStep((prev: number) => prev + 1);
  };

  return (
    <div>
      <p>Flag: {flag ? "True" : "False"}</p>
      <p>Step: {step}</p>
      <button type="button" onClick={handleToggleAndAdvance}>
        Advance Step and Toggle Flag
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const UseStateContainer: React.FC = () => {
  return (
    <div>
      <h1>01 - useState</h1>

      <h2>1. Primitive State & Direct Assignment</h2>
      <BasicState initialCount={0} />

      <h2>2. Functional Updates & Stale Closure Prevention</h2>
      <FunctionalState initialValue="Initial String" />

      <h2>3. Multiple State Variables</h2>
      <MultipleStateHooks />
    </div>
  );
};

export default UseStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Calling useState returns the current state value and a set function to update it.
// - Passing an updater function to the set function guarantees updates use the latest pending state.
// - Setting state with a value identical to current state via Object.is skips re-rendering.
// - React maintains state across re-renders based on the component position in the UI tree.
// - State setter updates trigger a re-render cycle rather than mutating variables in place.
