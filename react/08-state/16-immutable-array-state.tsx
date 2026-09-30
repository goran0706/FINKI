/**
 * Immutable Array State
 * =====================
 *
 * Updating arrays in React state requires treating array structures as read-only. Common JavaScript
 * operations like `splice()`, `push()`, or direct index assignment (`arr[i] = value`) mutate the original
 * array in place, altering its memory reference without changing identity, which causes React's `Object.is`
 * check to determine no state change occurred and skip re-rendering.
 *
 * To insert, replace, or update nested items immutably, construct a new array reference containing copies
 * of updated elements. Replacing items at specific indices is accomplished via `map()`, insertion is handled
 * via `slice()` with spread operators, and modifying objects inside arrays requires shallow copying both
 * the container array and the target element.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TodoItem {
  readonly id: number;
  readonly text: string;
  readonly completed: boolean;
}

export interface ImmutableArrayProps {
  readonly initialTodos: readonly TodoItem[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ArrayItemInsertionAndReplacement: React.FC<ImmutableArrayProps> = ({ initialTodos }) => {
  const [todos, setTodos] = useState<readonly TodoItem[]>(initialTodos);

  const handleInsertAtMiddle = (): void => {
    const insertIndex = Math.floor(todos.length / 2);
    const newTodo: TodoItem = {
      id: Date.now(),
      text: "Inserted Middle Task",
      completed: false,
    };

    // Insert immutably using slice and spread syntax
    const nextTodos = [...todos.slice(0, insertIndex), newTodo, ...todos.slice(insertIndex)];

    setTodos(nextTodos);
  };

  const handleReplaceAtIndex = (targetId: number): void => {
    // Replace item immutably using map
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === targetId) {
          return {
            ...todo,
            text: `${todo.text} [Replaced]`,
          };
        }
        return todo;
      }),
    );
  };

  return (
    <div>
      <button type="button" onClick={handleInsertAtMiddle}>
        Insert Item At Middle (Slice + Spread)
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}{" "}
            <button type="button" onClick={() => handleReplaceAtIndex(todo.id)}>
              Replace Text
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NestedArrayObjectImmutability: React.FC<ImmutableArrayProps> = ({ initialTodos }) => {
  const [todos, setTodos] = useState<readonly TodoItem[]>(initialTodos);

  const handleToggleCompleted = (targetId: number): void => {
    // Correct immutable update: Copy array and copy updated item
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === targetId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      }),
    );
  };

  const handleDirectMutationBug = (): void => {
    // BAD PRACTICE: Direct mutation of item inside array state fails Object.is change detection
    if (todos.length > 0) {
      const mutableTodo = todos[0] as { completed: boolean };
      mutableTodo.completed = !mutableTodo.completed;
      setTodos(todos);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleDirectMutationBug}>
        Mutate Array Item Directly (Broken)
      </button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text} ({todo.completed ? "Completed" : "Pending"})
            </span>{" "}
            <button type="button" onClick={() => handleToggleCompleted(todo.id)}>
              Toggle Completion (Immutable Copy)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ImmutableArrayStateContainer: React.FC = () => {
  const defaultTodos: readonly TodoItem[] = [
    { id: 1, text: "Configure TS Linting", completed: true },
    { id: 2, text: "Implement State Reducers", completed: false },
    { id: 3, text: "Review Architecture Specs", completed: false },
  ];

  return (
    <div>
      <h1>16 - Immutable Array State</h1>

      <h2>1. Inserting and Replacing Array Items Immutably</h2>
      <ArrayItemInsertionAndReplacement initialTodos={defaultTodos} />

      <h2>2. Updating Objects Inside Array State Immutably</h2>
      <NestedArrayObjectImmutability initialTodos={defaultTodos} />
    </div>
  );
};

export default ImmutableArrayStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Modifying array items in place bypasses React state identity checks and prevents UI re-renders.
// - Inserting items at arbitrary positions requires combining slice calls with array spread syntax.
// - Replacing or updating items in an array is safely handled using map to return new element copies.
// - Updating nested objects within arrays requires copying both the containing array and modified objects.
// - Always generate fresh array and object references when dispatching array updates to state setters.
