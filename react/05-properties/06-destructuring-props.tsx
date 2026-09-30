/**
 * Destructuring Props
 * ===================
 *
 * Destructuring props extracts individual property values from the incoming props object and assigns
 * them to local variables. The destructuring can be performed directly in the component parameter list
 * or inside the component body, with both approaches providing the same runtime behavior.
 *
 * Destructuring inside the component body keeps the component signature compact and places the extracted
 * data together in a clearly visible block. This formatting approach can be particularly useful when a
 * component accepts several props, as parameter-list destructuring can become heavily indented in some
 * editors and reduce the readability of the function declaration.
 *
 * Local destructuring also supports default values, property renaming, and selective extraction while
 * eliminating repetitive `props.` prefixes throughout the component implementation.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Props Interface
// ---------------------------------------------------------------------

export interface UserCardProps {
  readonly userId: string;
  readonly fullName: string;
  readonly roleTitle: string;
  readonly avatarUrl?: string;
  readonly isOnline?: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Utilizing Body Prop Destructuring
// ---------------------------------------------------------------------

export const UserCard: React.FC<UserCardProps> = (props) => {
  // Data: Extract required and optional properties into local variables
  const { userId, fullName, roleTitle, avatarUrl = "https://via.placeholder.com/150", isOnline = false } = props;

  // Logic: Derived values calculated from destructured data
  const statusLabel = isOnline ? "Active Now" : "Offline";
  const userIdentifier = `ID: ${userId.toUpperCase()}`;

  // Appearance: Declarative JSX output
  return (
    <div className="user-card">
      <img src={avatarUrl} alt={fullName} className="user-avatar" />
      <div className="user-info">
        <h4>{fullName}</h4>
        <p className="role">{roleTitle}</p>
        <span className={`status ${isOnline ? "online" : "offline"}`}>{statusLabel}</span>
        <small>{userIdentifier}</small>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Component Passing Data
// ---------------------------------------------------------------------

export const UserCardContainer: React.FC = () => {
  return (
    <section className="user-card-container">
      <h2>Team Members</h2>{" "}
      <UserCard userId="usr_8821" fullName="Sarah Connor" roleTitle="Lead Systems Architect" isOnline={true} />
    </section>
  );
};

export default UserCardContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Local Extraction: Destructuring inside the component body assigns selected props to local variables.
// - Signature Readability: Body destructuring keeps components with many props from producing heavily indented function parameters.
// - Equivalent Syntax: Parameter-list and body destructuring provide the same destructuring behavior; the choice is primarily stylistic.
// - Default Values: Destructuring assignment can provide fallback values for optional props when they are `undefined`.
// - Property Aliasing: Destructuring supports renaming a property when the local variable requires a different identifier.
// - Selective Extraction: Only the properties required by the component need to be extracted from the props object.
