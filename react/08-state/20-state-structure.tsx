/**
 * State Structure
 * ===============
 *
 * Structuring state effectively involves organizing component memory to make updates easy and bug-free.
 * Key principles for structuring state include grouping related state variables that always update together,
 * avoiding deeply nested state objects that complicate immutable updates, and avoiding redundant or duplicate
 * state data.
 *
 * Flattening state structures by normalizing data with IDs makes updating individual items straightforward,
 * preventing complex nested object spread operations during state updates.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface PlaceNode {
  readonly id: number;
  readonly title: string;
  readonly childIds: readonly number[];
}

export interface FlatPlacesMap {
  readonly [id: number]: PlaceNode;
}

export interface StateStructureProps {
  readonly initialPosition: Position;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const GroupedStatePointer: React.FC<StateStructureProps> = ({ initialPosition }) => {
  // Grouping related x and y coordinates into a single state object
  const [position, setPosition] = useState<Position>(initialPosition);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        touchAction: "none",
      }}
    >
      <p>Grouped Position X: {position.x}</p>
      <p>Grouped Position Y: {position.y}</p>
      <p>Move cursor here to update both coordinates together in state</p>
    </div>
  );
};

export const FlatNormalizedTree: React.FC = () => {
  // Flat normalized state structure using an ID map instead of deep nesting
  const [places, setPlaces] = useState<FlatPlacesMap>({
    1: { id: 1, title: "Earth", childIds: [2, 3] },
    2: { id: 2, title: "North America", childIds: [] },
    3: { id: 3, title: "Europe", childIds: [] },
  });

  const handleUpdateTitle = (id: number, newTitle: string): void => {
    // Flat structures make updating specific items simple without deep nesting
    setPlaces((prevPlaces) => ({
      ...prevPlaces,
      [id]: {
        ...prevPlaces[id],
        title: newTitle,
      },
    }));
  };

  return (
    <div>
      <ul>
        {Object.values(places).map((place) => (
          <li key={place.id}>
            {place.title}{" "}
            <button type="button" onClick={() => handleUpdateTitle(place.id, `${place.title} (Updated)`)}>
              Rename Item
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

export const StateStructureContainer: React.FC = () => {
  return (
    <div>
      <h1>20 - State Structure</h1>

      <h2>1. Grouping Related State Variables</h2>
      <GroupedStatePointer initialPosition={{ x: 0, y: 0 }} />

      <h2>2. Flat Normalized State Structure</h2>
      <FlatNormalizedTree />
    </div>
  );
};

export default StateStructureContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Group related state variables together if they always change and update at the same time.
// - Avoid deeply nested state structures to prevent complex and error-prone copy operations.
// - Normalizing state data into flat lookup objects with IDs makes targeted updates simple.
// - Avoid redundant and duplicate state data to keep updates synchronized across components.
// - Structuring state cleanly reduces bug surface area and streamlines component rendering logic.
