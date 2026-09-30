/**
 * Parent to Child Communication
 * =============================
 *
 * Parent-to-child communication in React is achieved exclusively through passing props down the
 * component tree. A parent component configures and controls child component behavior by passing
 * primitive values, objects, arrays, or functions as read-only property snapshots.
 *
 * Child components remain pure and declarative regarding their input props, rendering UI based on
 * received values without altering the received props directly. This flow guarantees that data
 * updates originate from authoritative parent state sources and propagate predictably downward.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserProfile {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly status: "active" | "inactive";
}

export interface UserCardProps {
  readonly user: UserProfile;
}

export interface StatusIndicatorProps {
  readonly status: "active" | "inactive";
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  return <span>[{status.toUpperCase()}]</span>;
};

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  // Child component receives props from parent and renders declarative UI
  return (
    <div>
      <h3>{user.name}</h3>
      <p>Role: {user.role}</p>
      <p>
        Status: <StatusIndicator status={user.status} />
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ParentToChildCommunicationContainer: React.FC = () => {
  // Parent component manages authoritative state and passes snapshot down
  const [user, setUser] = useState<UserProfile>({
    id: 1,
    name: "Alex Vance",
    role: "System Architect",
    status: "active",
  });

  const handleToggleStatus = (): void => {
    setUser((prevUser) => ({
      ...prevUser,
      status: prevUser.status === "active" ? "inactive" : "active",
    }));
  };

  return (
    <div>
      <h1>02 - Parent to Child Communication</h1>

      <h2>1. Passing Structured Data and Props to Child Components</h2>
      <UserCard user={user} />

      <button type="button" onClick={handleToggleStatus}>
        Toggle User Status (Parent State Update)
      </button>
    </div>
  );
};

export default ParentToChildCommunicationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Props are the primary mechanism for passing data downward from parent to child components.
// - Child components treat all incoming props as immutable, read-only data snapshots.
// - Complex objects and primitive values can be passed down seamlessly across render boundaries.
// - Passing props explicitly maintains clear component contracts and enforces top-down data flow.
// - Parent components maintain total control over child configuration and rendering inputs.
