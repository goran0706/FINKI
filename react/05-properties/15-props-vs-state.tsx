/**
 * Props vs. State
 * ===============
 *
 * Understanding the fundamental boundary between props and state is essential for React architecture.
 * Props represent external configuration passed down from a parent component and are strictly read-only,
 * whereas state represents private, mutable data managed internally within a component.
 *
 * External props cascade downward from parent components, while internal state remains isolated
 * and mutable via dedicated setter functions. Updating internal state triggers predictable top-down
 * re-renders, passing fresh prop values to child components through unidirectional data flows.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface GreetingProps {
  readonly name: string;
}

// ---------------------------------------------------------------------
// 2. Stateless Child Component (Props Consumer)
// ---------------------------------------------------------------------

export const Greeting: React.FC<GreetingProps> = (props) => {
  const { name } = props;

  return (
    <div>
      <p>Hello, {name}! (This value came from parent props)</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Stateful Parent Component (State Owner)
// ---------------------------------------------------------------------

export const SimplePropsVsStateContainer: React.FC = () => {
  // ---------------------------------------------------------------------
  // 1. State & Hooks Layer
  // ---------------------------------------------------------------------
  const [userName, setUserName] = useState<string>("Alice");

  // ---------------------------------------------------------------------
  // 2. Render Logic & Event Handlers Layer
  // ---------------------------------------------------------------------
  const handleNameChange = (): void => {
    setUserName((prev) => (prev === "Alice" ? "Bob" : "Alice"));
  };

  // ---------------------------------------------------------------------
  // 3. Appearance (Render) Layer
  // ---------------------------------------------------------------------
  return (
    <div>
      <h2>Props vs State Simple Demo</h2>
      <p>Internal State Value: {userName}</p>

      <button type="button" onClick={handleNameChange}>
        Change Internal State
      </button>

      <Greeting name={userName} />
    </div>
  );
};

export default SimplePropsVsStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - External Configuration: Props are read-only inputs passed downward from parents and cannot be modified by receiving child components.
// - Internal State Ownership: State is isolated component memory created and updated using the `useState` hook.
// - Unidirectional Data Cascade: Updating state triggers component re-renders, propagating updated prop values to child nodes automatically.
// - Clean Architectural Boundaries: Enforces separation between state-owning containers and purely presentational child components.
// - Clean Architecture Compliance: Inputs are explicitly destructured on separate lines inside component bodies, maintaining standard layout rules.
