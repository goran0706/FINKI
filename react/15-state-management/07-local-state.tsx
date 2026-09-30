/**
 * Local State
 * ===========
 *
 * Local state is data declared and encapsulated entirely within a single component using hooks like
 * `useState` or `useReducer`. It represents ephemeral UI state—such as form inputs, toggle switches, or
 * expansion flags—that does not need to be shared with or observed by other parts of the component tree.
 *
 * Encapsulating state locally keeps components self-contained, highly reusable, and isolated from
 * external dependencies. Updating local state triggers re-renders exclusively for that component and its
 * nested children, preserving performance across the broader application tree.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LocalInputProps {
  readonly initialValue?: string;
  readonly placeholder?: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const LocalInputForm: React.FC<LocalInputProps> = ({ initialValue = "", placeholder = "Enter text..." }) => {
  // Encapsulated local state: Kept strictly within this form component
  const [text, setText] = useState<string>(initialValue);

  const handleClear = (): void => {
    setText("");
  };

  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
      <button type="button" onClick={handleClear}>
        Clear Input
      </button>
      <p>Character count: {text.length}</p>
    </div>
  );
};

export const LocalToggle: React.FC = () => {
  // Encapsulated local state: Self-contained boolean flag
  const [isOn, setIsOn] = useState<boolean>(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOn((prev) => !prev)}>
        Toggle Status: {isOn ? "ACTIVE" : "INACTIVE"}
      </button>
      <p>Component visual state: {isOn ? "Highlighted" : "Default"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const LocalStateContainer: React.FC = () => {
  return (
    <div>
      <h1>07 - Local State</h1>

      <h2>1. Encapsulated Text Input Form</h2>
      <LocalInputForm placeholder="Type internal notes..." />

      <h2>2. Encapsulated Interactive Toggle</h2>
      <LocalToggle />
    </div>
  );
};

export default LocalStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Local state is managed internally within a single component instance using React hooks.
// - Keeping transient UI state local prevents polluting parent state and simplifies component contracts.
// - Local state updates re-render only the declared component and its downstream children.
// - Independent instances of the same component maintain isolated copies of local state.
// - Encapsulating local state promotes modularity, testability, and clean UI architecture.
