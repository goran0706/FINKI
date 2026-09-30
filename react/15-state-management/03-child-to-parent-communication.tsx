/**
 * Child to Parent Communication
 * =============================
 *
 * Child components cannot directly modify parent state. To communicate events or data updates
 * upward, parent components pass callback functions down to child components as props.
 *
 * When an event occurs inside a child component, it executes the passed callback function,
 * sending payload data back up as arguments. The parent receives the arguments inside its
 * callback handler and updates its own state, triggering a predictable top-down re-render.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SearchInputProps {
  readonly onSearchSubmit: (searchTerm: string) => void;
}

export interface ToggleSwitchProps {
  readonly isChecked: boolean;
  readonly onToggleChange: (checked: boolean) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SearchInput: React.FC<SearchInputProps> = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    onSearchSubmit(query.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter search query..." />
      <button type="submit">Search</button>
    </form>
  );
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onToggleChange }) => {
  return (
    <button type="button" onClick={() => onToggleChange(!isChecked)}>
      Toggle: {isChecked ? "ON" : "OFF"}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ChildToParentCommunicationContainer: React.FC = () => {
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const handleSearchSubmit = (searchTerm: string): void => {
    setSubmittedQuery(searchTerm);
  };

  const handleToggleChange = (checked: boolean): void => {
    setIsEnabled(checked);
  };

  return (
    <div>
      <h1>03 - Child to Parent Communication</h1>

      <h2>1. Executing Callbacks with Data Payloads</h2>
      <SearchInput onSearchSubmit={handleSearchSubmit} />
      <p>Submitted Query Payload: {submittedQuery || "None"}</p>

      <h2>2. Notifying Parent of Boolean State Changes</h2>
      <ToggleSwitch isChecked={isEnabled} onToggleChange={handleToggleChange} />
      <p>Parent Feature Status: {isEnabled ? "Active" : "Disabled"}</p>
    </div>
  );
};

export default ChildToParentCommunicationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Child-to-parent communication is implemented by passing callback functions as props.
// - Child components invoke parent callbacks with arguments to send payload data upward.
// - Parent handler functions update local parent state upon receiving callback triggers.
// - Invoking parent callbacks triggers a top-down re-render cycle with updated state values.
// - Data flows upward via events while state continues flowing strictly top-down via props.
