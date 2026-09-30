/**
 * Context Provider
 * ================
 *
 * A Context Provider is a React component that wraps a component tree and supplies a context value
 * to all downstream descendants. Every `Context` object comes with a `Provider` React component that
 * accepts a `value` prop to be consumed by descendant components.
 *
 * Encapsulating provider logic inside a custom Provider component pairs local state management with
 * context broadcasting. This pattern keeps context state management self-contained, clean, and reusable
 * across different parts of the application hierarchy.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Notification {
  readonly id: number;
  readonly message: string;
}

export interface NotificationContextType {
  readonly notifications: readonly Notification[];
  readonly addNotification: (message: string) => void;
  readonly clearNotifications: () => void;
}

export interface NotificationProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Context Creation
// ---------------------------------------------------------------------

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ---------------------------------------------------------------------
// 3. Custom Provider Component Implementation
// ---------------------------------------------------------------------

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<readonly Notification[]>([]);

  const addNotification = (message: string): void => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const clearNotifications = (): void => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// ---------------------------------------------------------------------
// 4. Consumer Component Implementations
// ---------------------------------------------------------------------

export const NotificationTrigger: React.FC = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("NotificationTrigger must be used within a NotificationProvider");
  }

  const { addNotification, clearNotifications } = context;

  return (
    <div>
      <button type="button" onClick={() => addNotification(`Event triggered at ${new Date().toLocaleTimeString()}`)}>
        Add Notification
      </button>
      <button type="button" onClick={clearNotifications}>
        Clear All
      </button>
    </div>
  );
};

export const NotificationList: React.FC = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("NotificationList must be used within a NotificationProvider");
  }

  const { notifications } = context;

  return (
    <div>
      <h4>Notifications Log ({notifications.length})</h4>
      {notifications.length === 0 ? (
        <p>No active notifications.</p>
      ) : (
        <ul>
          {notifications.map((item) => (
            <li key={item.id}>{item.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Main Container Component
// ---------------------------------------------------------------------

export const ContextProvider: React.FC = () => {
  return (
    <NotificationProvider>
      <div>
        <h1>17 - Context Provider</h1>

        <h2>1. Encapsulated Custom Context Provider Component</h2>
        <NotificationTrigger />
        <NotificationList />
      </div>
    </NotificationProvider>
  );
};

export default ContextProvider;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A Context Provider makes state and callbacks available to all descendant components.
// - Custom Provider components combine local state logic with Context value broadcasting.
// - Encapsulating provider state prevents state leakages into container or route components.
// - Downstream consumers re-render automatically when provider state values update.
// - Wrapping subtrees in custom providers promotes modular, reusable state architecture.
