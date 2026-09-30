/**
 * Typed Drag Events
 * ==================
 *
 * React provides the `DragEvent<T>` type for drag-and-drop interactions. The generic element
 * parameter identifies the element receiving the handler and gives `currentTarget` an
 * element-specific TypeScript type.
 *
 * Drag events extend the mouse-event model and expose a `dataTransfer` object containing the
 * data and metadata associated with the current drag operation. Events such as `dragstart`,
 * `dragover`, and `drop` occur at different stages of a drag-and-drop interaction.
 *
 * A drop target normally needs to cancel the browser's default `dragover` behavior before it
 * can receive a drop event. The `dataTransfer` object can then be used to read or write the
 * data transferred by the operation.
 */

import React, { type DragEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DragStartProps {
  readonly label: string;
}

export interface DragOverProps {
  readonly label: string;
}

export interface DropProps {
  readonly label: string;
}

export interface DragDataProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `DragEvent<HTMLDivElement>` gives a drag-start handler an element-specific
 * `currentTarget` while exposing drag metadata through `dataTransfer`.
 */
export const DragStart: React.FC<DragStartProps> = ({ label }): ReactElement => {
  const handleDragStart = (event: DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData("text/plain", label);

    console.log("Drag started:", event.currentTarget);
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      {label}
    </div>
  );
};

/**
 * A drop target normally calls `preventDefault()` during `dragover` so the
 * browser permits a subsequent drop operation at that location.
 */
export const DragOver: React.FC<DragOverProps> = ({ label }): ReactElement => {
  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();

    console.log("Drag over:", event.currentTarget);
  };

  return <div onDragOver={handleDragOver}>{label}</div>;
};

/**
 * The `drop` event provides access to the transferred data through the
 * event's `dataTransfer` object.
 */
export const Drop: React.FC<DropProps> = ({ label }): ReactElement => {
  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();

    const droppedText: string = event.dataTransfer.getData("text/plain");

    console.log("Dropped text:", droppedText);
  };

  return <div onDrop={handleDrop}>{label}</div>;
};

/**
 * `dataTransfer` exposes information about the current drag operation,
 * including available data types and the permitted drag effect.
 */
export const DragData: React.FC<DragDataProps> = ({ label }): ReactElement => {
  const handleDragStart = (event: DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", label);

    console.log("Available types:", event.dataTransfer.types);
    console.log("Effect allowed:", event.dataTransfer.effectAllowed);
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      {label}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedDragEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Starting a Drag Operation</h2>
      <DragStart label="Drag this item" />

      <h2>2. Preparing a Drop Target</h2>
      <DragOver label="Drag over this area" />

      <h2>3. Receiving Dropped Data</h2>
      <Drop label="Drop here" />

      <h2>4. Inspecting Transfer Metadata</h2>
      <DragData label="Drag with transfer data" />
    </div>
  );
};

export default TypedDragEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React drag handlers use the specialized `DragEvent<T>` type.
// - The generic parameter identifies the element receiving the drag handler.
// - `event.dataTransfer` provides access to data and metadata for the drag operation.
// - `dragstart` can populate `dataTransfer` with application-defined data.
// - A drop target normally calls `preventDefault()` during `dragover` to allow dropping.
// - `drop` can retrieve transferred data through `dataTransfer.getData()`.
// - `effectAllowed` describes the operations permitted by the drag source.
