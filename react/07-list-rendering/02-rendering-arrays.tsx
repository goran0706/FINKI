/**
 * Rendering Arrays
 * ================
 *
 * Array rendering in React leverages native JavaScript array methods to transform raw data
 * structures into collections of virtual DOM nodes. Functional array operations like `map`,
 * `filter`, and `slice` enable declarative data manipulation directly within render loops.
 *
 * Maintaining immutability during array transformations ensures reliable state change detection
 * and predictable UI re-renders. Passing primitive arrays or structured object arrays requires
 * extracting stable keys to preserve item identity during list reconciliation.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: string;
  readonly name: string;
  readonly score: number;
  readonly active: boolean;
}

export interface PrimitiveArrayProps {
  readonly tags: ReadonlyArray<string>;
}

export interface ObjectArrayProps {
  readonly users: ReadonlyArray<User>;
}

export interface TransformedArrayProps {
  readonly users: ReadonlyArray<User>;
  readonly minScore: number;
}

// ---------------------------------------------------------------------
// 2. Array Component Implementations
// ---------------------------------------------------------------------

export const PrimitiveArrayList: React.FC<PrimitiveArrayProps> = (props) => {
  const { tags } = props;

  return (
    <div>
      {tags.map((tag: string, index: number) => (
        <p key={`${tag}-${index}`}>Tag: {tag}</p>
      ))}
    </div>
  );
};

export const ObjectArrayList: React.FC<ObjectArrayProps> = (props) => {
  const { users } = props;

  return (
    <div>
      {users.map((user: User) => (
        <div key={user.id}>
          <p>
            {user.name} - Score: {user.score} ({user.active ? "Active" : "Inactive"})
          </p>
        </div>
      ))}
    </div>
  );
};

export const TransformedArrayList: React.FC<TransformedArrayProps> = (props) => {
  const { users, minScore } = props;

  const filteredUsers = users.filter((user: User) => user.active && user.score >= minScore).slice(0, 5);

  return (
    <div>
      {filteredUsers.map((user: User) => (
        <p key={user.id}>
          Filtered: {user.name} ({user.score} pts)
        </p>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const RenderingArraysContainer: React.FC = () => {
  const tags: ReadonlyArray<string> = ["React", "TypeScript", "JavaScript", "JSX"];

  const users: ReadonlyArray<User> = [
    { id: "u1", name: "Alice", score: 95, active: true },
    { id: "u2", name: "Bob", score: 70, active: false },
    { id: "u3", name: "Charlie", score: 88, active: true },
    { id: "u4", name: "Diana", score: 60, active: true },
  ];

  return (
    <div>
      <h1>Rendering Arrays</h1>

      <h2>1. Primitive Array Rendering</h2>
      <PrimitiveArrayList tags={tags} />

      <h2>2. Object Array Rendering</h2>
      <ObjectArrayList users={users} />

      <h2>3. Transformed Array Rendering (.filter + .slice)</h2>
      <TransformedArrayList users={users} minScore={80} />
    </div>
  );
};

export default RenderingArraysContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Primitive Mapping: Projects array strings or numbers into JSX using index compound keys.
// - Object Array Mapping: Extracts stable domain entity properties (`user.id`) for reconciliation keys.
// - Inline Transformations: Chains `.filter()` and `.slice()` to derive renderable array subsets.
// - Immutability Enforcement: Uses `ReadonlyArray<T>` annotations to guarantee read-only data access.
// - Dedicated Line Destructuring: Enforces single-property line breaks during prop destructuring.
