/**
 * Reducer
 * =======
 *
 * A reducer is a pure, deterministic function that consolidates state update logic outside of
 * components. It takes the current state and an action object as arguments, calculates the next
 * state immutably, and returns it without causing side effects.
 *
 * Moving state update logic into a reducer separates event handling from state transition rules.
 * This pattern simplifies debugging, centralizes state updates, and improves code readability.
 */

import React, { useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Task {
  readonly id: number;
  readonly text: string;
  readonly completed: boolean;
}

export interface TaskState {
  readonly tasks: readonly Task[];
}

export type TaskAction =
  | { readonly type: "ADD_TASK"; readonly text: string }
  | { readonly type: "TOGGLE_TASK"; readonly id: number }
  | { readonly type: "DELETE_TASK"; readonly id: number };

export interface TaskListProps {
  readonly tasks: readonly Task[];
  readonly onToggle: (id: number) => void;
  readonly onDelete: (id: number) => void;
}

// ---------------------------------------------------------------------
// 2. Pure Reducer Function
// ---------------------------------------------------------------------

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "ADD_TASK": {
      const newTask: Task = {
        id: Date.now(),
        text: action.text,
        completed: false,
      };
      return { tasks: [...state.tasks, newTask] };
    }
    case "TOGGLE_TASK": {
      return {
        tasks: state.tasks.map((task) => (task.id === action.id ? { ...task, completed: !task.completed } : task)),
      };
    }
    case "DELETE_TASK": {
      return {
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };
    }
    default:
      return state;
  }
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <span>{task.text}</span>
          <button type="button" onClick={() => onToggle(task.id)}>
            Toggle
          </button>
          <button type="button" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ReducerContainer: React.FC = () => {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [
      { id: 1, text: "Review pull requests", completed: false },
      { id: 2, text: "Write technical documentation", completed: true },
    ],
  });

  const handleAddTask = (): void => {
    dispatch({ type: "ADD_TASK", text: "New Automated Task" });
  };

  return (
    <div>
      <h1>24 - Reducer</h1>

      <h2>1. Centralized State Transitions via Pure Reducer Function</h2>
      <button type="button" onClick={handleAddTask}>
        Add Task
      </button>
      <TaskList
        tasks={state.tasks}
        onToggle={(id) => dispatch({ type: "TOGGLE_TASK", id })}
        onDelete={(id) => dispatch({ type: "DELETE_TASK", id })}
      />
    </div>
  );
};

export default ReducerContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reducers are pure functions calculating the next state from current state and an action.
// - Extracting transition logic into reducers separates event handlers from state mutations.
// - Reducer functions must remain deterministic and completely free of side effects.
// - Action objects explicitly describe the user intent driving a specific state change.
// - Centralizing state logic inside reducers simplifies testing and debugging workflows.
