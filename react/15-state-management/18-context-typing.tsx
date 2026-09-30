/**
 * Typed Context
 * =============
 *
 * Typed context ensures end-to-end type safety when passing state and callbacks through the React
 * component tree. Because `createContext` often initializes with `undefined` before a provider is
 * mounted, TypeScript requires explicit type definitions to prevent runtime null reference errors.
 *
 * Combining strongly typed context interfaces with custom encapsulation hooks guarantees that context
 * is consumed within a valid Provider subtree. The custom hook performs runtime validation, throwing
 * an error if invoked outside the provider, eliminating repetitive undefined checks in consumers.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserSession {
  readonly id: string;
  readonly username: string;
  readonly role: "admin" | "user";
}

export interface SessionContextType {
  readonly session: UserSession | null;
  readonly isAuthenticated: boolean;
  readonly login: (username: string, role: "admin" | "user") => void;
  readonly logout: () => void;
}

export interface SessionProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Context Creation & Custom Consumption Hook
// ---------------------------------------------------------------------

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 3. Provider Component Implementation
// ---------------------------------------------------------------------

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);

  const login = (username: string, role: "admin" | "user"): void => {
    setSession({
      id: `usr-${Date.now()}`,
      username,
      role,
    });
  };

  const logout = (): void => {
    setSession(null);
  };

  const value: SessionContextType = {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// ---------------------------------------------------------------------
// 4. Consumer Component Implementations
// ---------------------------------------------------------------------

export const SessionDetails: React.FC = () => {
  // Clean consumption via typed hook without repeating undefined checks
  const { session, isAuthenticated } = useSession();

  if (!isAuthenticated || !session) {
    return <p>No active user session found.</p>;
  }

  return (
    <div>
      <h4>Active User Session</h4>
      <p>User ID: {session.id}</p>
      <p>Username: {session.username}</p>
      <p>Role: {session.role.toUpperCase()}</p>
    </div>
  );
};

export const SessionControls: React.FC = () => {
  const { isAuthenticated, login, logout } = useSession();

  return (
    <div>
      {isAuthenticated ? (
        <button type="button" onClick={logout}>
          Log Out
        </button>
      ) : (
        <button type="button" onClick={() => login("dev_lead", "admin")}>
          Log In as Lead Developer
        </button>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Main Container Component
// ---------------------------------------------------------------------

export const TypedContextContainer: React.FC = () => {
  return (
    <SessionProvider>
      <div>
        <h1>19 - Typed Context</h1>

        <h2>1. Type-Safe Context Access via Custom Hook</h2>
        <SessionControls />
        <SessionDetails />
      </div>
    </SessionProvider>
  );
};

export default TypedContextContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Typed context leverages TypeScript interfaces to define state properties and updater methods.
// - Initializing context with undefined models out-of-bounds usage before provider instantiation.
// - Encapsulating context inside custom hooks centralizes runtime check validation logic.
// - Custom context hooks strip undefined types, providing non-null values to consumer components.
// - Strong type definitions eliminate manual casting and runtime null errors across descendant trees.
