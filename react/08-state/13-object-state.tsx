/**
 * Object State
 * ============
 *
 * State in React can hold JavaScript objects, but object mutation must be avoided. Direct mutation of object
 * properties (`state.x = 5`) does not change the object's reference identity, causing React's `Object.is` check
 * to treat the state as unchanged and skip re-rendering.
 *
 * To update an object state variable, create a new object (or make a copy of an existing one) using object spread
 * syntax (`...state`) and pass the fresh reference to the state set function.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserPosition {
  readonly x: number;
  readonly y: number;
}

export interface UserProfile {
  readonly name: string;
  readonly details: {
    readonly title: string;
    readonly email: string;
  };
}

export interface ObjectStateProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PositionTracker: React.FC = () => {
  const [position, setPosition] = useState<UserPosition>({ x: 0, y: 0 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    // Create a new object reference rather than mutating existing position
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
      <p>Pointer X: {position.x}</p>
      <p>Pointer Y: {position.y}</p>
      <p>Move pointer over this box to update position state</p>
    </div>
  );
};

export const ProfileForm: React.FC<ObjectStateProps> = ({ initialName }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: initialName,
    details: {
      title: "Software Engineer",
      email: "dev@example.com",
    },
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      name: event.target.value,
    }));
  };

  const handleNestedEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Deep updates require spreading nested object levels to maintain immutability
    setProfile((prevProfile) => ({
      ...prevProfile,
      details: {
        ...prevProfile.details,
        email: event.target.value,
      },
    }));
  };

  return (
    <div>
      <p>User Name: {profile.name}</p>
      <p>Title: {profile.details.title}</p>
      <p>Email: {profile.details.email}</p>

      <label htmlFor="name-input">Name: </label>
      <input id="name-input" type="text" value={profile.name} onChange={handleNameChange} />

      <br />

      <label htmlFor="email-input">Email: </label>
      <input id="email-input" type="text" value={profile.details.email} onChange={handleNestedEmailChange} />
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ObjectStateContainer: React.FC = () => {
  return (
    <div>
      <h1>13 - Object State</h1>

      <h2>1. Updating Object References via Spread Operators</h2>
      <PositionTracker />

      <h2>2. Updating Nested Object Properties Immutably</h2>
      <ProfileForm initialName="Alex Developer" />
    </div>
  );
};

export default ObjectStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State holding JavaScript objects must be treated as immutable read-only structures.
// - Direct mutation of object properties fails Object.is checks and prevents re-rendering.
// - Object spread syntax allows copying existing properties while supplying new field values.
// - Updating nested object properties requires spreading every containing object layer up to the root.
// - Supplying fresh object references guarantees React recognizes state updates and schedules re-renders.
