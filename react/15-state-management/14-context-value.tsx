/**
 * Context Value
 * =============
 *
 * The `value` prop of a Context Provider defines the data payload made available to all descendant
 * consumer components. When the `value` prop changes based on reference equality (Object.is), all
 * components consuming that context are re-rendered.
 *
 * Combining state properties and updater callbacks into a single context value object allows descendants
 * to read state and request state transitions. Memoizing or structuring context values properly prevents
 * unintentional re-renders triggered by recreated object references during parent renders.
 */

import React, { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AuthUser {
  readonly id: string;
  readonly username: string;
  readonly email: string;
}

export interface AuthContextType {
  readonly user: AuthUser | null;
  readonly login: (username: string, email: string) => void;
  readonly logout: () => void;
}

// ---------------------------------------------------------------------
// 2. Context Creation
// ---------------------------------------------------------------------

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const UserProfileCard: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("UserProfileCard must be used within an AuthContext Provider");
  }

  const { user, logout } = auth;

  if (!user) {
    return <p>No active user session found.</p>;
  }

  return (
    <div>
      <h4>User Profile</h4>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <button type="button" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};

export const QuickLoginForm: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("QuickLoginForm must be used within an AuthContext Provider");
  }

  const { user, login } = auth;

  if (user) {
    return null;
  }

  return (
    <button type="button" onClick={() => login("dev_alex", "alex@example.com")}>
      Log In as Alex
    </button>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ContextValueContainer: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (username: string, email: string): void => {
    setUser({ id: "usr-101", username, email });
  };

  const logout = (): void => {
    setUser(null);
  };

  // Construct the context value object containing state and state mutators
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <div>
        <h1>16 - Context Value</h1>

        <h2>1. Supplying State and Handlers through Context Value Payload</h2>
        <QuickLoginForm />
        <UserProfileCard />
      </div>
    </AuthContext.Provider>
  );
};

export default ContextValueContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The Context Provider value prop distributes data and callbacks to consuming descendants.
// - Reference equality checks (Object.is) on the value prop determine if consumers re-render.
// - Bundling state snapshot data and mutator callbacks creates a comprehensive context payload.
// - Consumer components re-render whenever any property within the context value object updates.
// - Structuring context value payloads cleanly maintains predictable downstream state updates.
