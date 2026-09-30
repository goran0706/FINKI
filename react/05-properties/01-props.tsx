/**
 * Props
 * =====
 *
 * Props, short for properties, represent read-only inputs passed from a parent component to
 * a child component. They establish the fundamental contract for unidirectional data flow in React
 * applications.
 *
 * Incoming properties are strictly immutable within the receiving component, enforcing predictable
 * top-down data propagation. TypeScript interfaces define explicit contracts for component inputs,
 * ensuring that parent components supply correctly typed data that automatically triggers re-renders
 * whenever parent values change.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Props Interface Contract
// ---------------------------------------------------------------------

export interface UserProfileProps {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
}

// ---------------------------------------------------------------------
// 2. Child Component Consuming Props
// ---------------------------------------------------------------------

export const UserProfile: React.FC<UserProfileProps> = (props) => {
  return (
    <div className="user-profile">
      <h3>User Profile Information</h3>
      <p>ID: {props.id}</p>
      <p>Username: {props.username}</p>
      <p>Email: {props.email}</p>
      <p>Role: {props.role}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Component Passing Props
// ---------------------------------------------------------------------

export const UserProfileContainer: React.FC = () => {
  return (
    <section className="profile-container">
      <h2>User Management Dashboard</h2>
      <UserProfile id="usr_102938" username="alex_developer" email="alex@example.com" role="Administrator" />
    </section>
  );
};

export default UserProfileContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Unidirectional Data Flow: Props flow exclusively down the component tree from parent to child components.
// - Immutability Guarantee: Props are read-only within the receiving child component and cannot be mutated.
// - Input Contract Definition: TypeScript interfaces define the explicit data structure required by child components.
// - Deterministic Rendering: Passing identical prop values yields identical rendered JSX nodes consistently.
// - Parent Orchestration: Parent components own and control prop values, driving child re-renders on update.
