/**
 * Component Responsibilities
 * ==========================
 *
 * Adhering to the Single Responsibility Principle ensures that every component fulfills exactly
 * one well-defined role in the architecture. Splitting complex requirements into isolated
 * components prevents monolithic code smells, simplifies testing, and establishes clean separation
 * between status presentation, row layout, and list orchestration.
 *
 * Highly focused components maintain high cohesion and low coupling by operating via strict input
 * interfaces without external side-channel dependencies, enabling granular reusability across
 * different layouts and contexts.
 */

import React from "react";

// ---------------------------------------------------------------------
// Domain Model & Interfaces
// ---------------------------------------------------------------------

export type TaskStatus = "pending" | "completed" | "failed";

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus;
}

// ---------------------------------------------------------------------
// 1. Single Responsibility: Status Presentation Only
// ---------------------------------------------------------------------

export interface TaskStatusBadgeProps {
  readonly status: TaskStatus;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = (props) => {
  const { status } = props;

  const displayLabel = status.toUpperCase();

  return <span>[{displayLabel}]</span>;
};

// ---------------------------------------------------------------------
// 2. Single Responsibility: Item Layout & Action Dispatching
// ---------------------------------------------------------------------

export interface TaskRowProps {
  readonly id: string;
  readonly title: string;
  readonly status: TaskStatus;
  readonly onToggle: (id: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = (props) => {
  const { id, title, status, onToggle } = props;

  const handleToggle = (): void => {
    onToggle(id);
  };

  return (
    <li>
      <span>{title}</span>
      <TaskStatusBadge status={status} />
      <button type="button" onClick={handleToggle}>
        Toggle Status
      </button>
    </li>
  );
};

// ---------------------------------------------------------------------
// 3. Single Responsibility: Collection Orchestration & Fallbacks
// ---------------------------------------------------------------------

export interface TaskFeedProps {
  readonly tasks: ReadonlyArray<Task>;
  readonly onTaskToggle: (id: string) => void;
}

export const TaskFeed: React.FC<TaskFeedProps> = (props) => {
  const { tasks, onTaskToggle } = props;

  const totalTasks = tasks.length;
  const isEmpty = totalTasks === 0;

  if (isEmpty) {
    return <p>No tasks available.</p>;
  }

  return (
    <div>
      <header>
        <h2>Task Overview ({totalTasks})</h2>
      </header>
      <ul>
        {tasks.map((task) => (
          <TaskRow key={task.id} id={task.id} title={task.title} status={task.status} onToggle={onTaskToggle} />
        ))}
      </ul>
    </div>
  );
};

export default TaskFeed;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - TaskStatusBadge: Responsible solely for mapping raw status strings to badge UI markup.
// - TaskRow: Responsible strictly for combining status presentation with item-level interactions.
// - TaskFeed: Responsible exclusively for collection iteration, empty state evaluation, and layout composition.
