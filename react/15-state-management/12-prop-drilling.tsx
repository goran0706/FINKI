/**
 * Prop Drilling
 * =============
 *
 * Prop drilling occurs when props are passed down through multiple layers of intermediate child
 * components that do not need the data themselves, merely to reach a deeply nested component.
 *
 * While explicit prop passing keeps data flow visible, excessive prop drilling tightly couples
 * intermediate components to data structures they do not directly use. Recognizing prop drilling
 * helps identify when component composition, state restructuring, or React Context is required.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserProfile {
  readonly username: string;
  readonly role: string;
}

export interface UserAvatarProps {
  readonly user: UserProfile;
}

export interface UserMenuProps {
  readonly user: UserProfile;
}

export interface NavigationBarProps {
  readonly user: UserProfile;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
  // Deep leaf component: Actual consumer of the drilled user prop
  return (
    <div>
      <strong>{user.username}</strong> ({user.role})
    </div>
  );
};

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  // Intermediary component: Does not use user data directly, forwards to UserAvatar
  return (
    <div>
      <h4>User Menu (Intermediary)</h4>
      <UserAvatar user={user} />
    </div>
  );
};

export const NavigationBar: React.FC<NavigationBarProps> = ({ user }) => {
  // Top intermediary component: Forwards user prop down through navigation hierarchy
  return (
    <nav>
      <h3>Navigation Bar (Intermediary)</h3>
      <UserMenu user={user} />
    </nav>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const PropDrillingContainer: React.FC = () => {
  const [user, setUser] = useState<UserProfile>({
    username: "sarah_dev",
    role: "Administrator",
  });

  const handleRoleToggle = (): void => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === "Administrator" ? "Editor" : "Administrator",
    }));
  };

  return (
    <div>
      <h1>12 - Prop Drilling</h1>

      <h2>1. Explicit Prop Pass-Through Across Intermediate Components</h2>
      <NavigationBar user={user} />

      <button type="button" onClick={handleRoleToggle}>
        Toggle Role (Parent State)
      </button>
    </div>
  );
};

export default PropDrillingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Prop drilling is passing props through intermediary components that do not use them.
// - Explicit prop drilling preserves clear data flow visibility but introduces verbose boilerplate.
// - Intermediary components become unnecessarily coupled to prop signatures they merely forward.
// - Deep prop drilling signals a need for component composition or Context state sharing.
// - Restructuring component boundaries reduces the depth of prop pass-through channels.
