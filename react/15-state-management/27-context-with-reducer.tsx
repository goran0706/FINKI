/**
 * Context with Reducer
 * ====================
 *
 * Combining React Context with `useReducer` creates a powerful, scalable state management system
 * without external libraries. The reducer centralizes complex state transition rules, while Context
 * broadcasts state and the `dispatch` function down the component tree without prop-drilling.
 *
 * This architecture separates state logic from component UI, guarantees predictable unidirectional
 * data flow, and allows deep descendant components to dispatch strongly-typed actions effortlessly.
 */

import React, { createContext, ReactNode, useContext, useMemo, useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface & Action Definitions
// ---------------------------------------------------------------------

export type NotificationType = "info" | "success" | "warning";

export interface Notification {
  readonly id: string;
  readonly message: string;
  readonly type: NotificationType;
}

export interface NotificationState {
  readonly notifications: readonly Notification[];
}

export type NotificationAction =
  | {
      readonly type: "ADD_NOTIFICATION";
      readonly message: string;
      readonly notificationType: NotificationType;
    }
  | { readonly type: "REMOVE_NOTIFICATION"; readonly id: string }
  | { readonly type: "CLEAR_ALL" };

export interface NotificationContextType {
  readonly state: NotificationState;
  readonly dispatch: React.Dispatch<NotificationAction>;
}

export interface NotificationProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Pure Reducer & Initial State
// ---------------------------------------------------------------------

export const initialNotificationState: NotificationState = {
  notifications: [],
};

export const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const newNotification: Notification = {
        id: String(Date.now() + Math.random()),
        message: action.message,
        type: action.notificationType,
      };
      return { notifications: [...state.notifications, newNotification] };
    }
    case "REMOVE_NOTIFICATION":
      return {
        notifications: state.notifications.filter((n) => n.id !== action.id),
      };
    case "CLEAR_ALL":
      return initialNotificationState;
    default:
      return state;
  }
};

// ---------------------------------------------------------------------
// 3. Context Creation & Custom Consumption Hook
// ---------------------------------------------------------------------

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 4. Provider Component Implementation
// ---------------------------------------------------------------------

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);

  const value = useMemo<NotificationContextType>(() => ({ state, dispatch }), [state]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// ---------------------------------------------------------------------
// 5. Consumer Component Implementations
// ---------------------------------------------------------------------

export const NotificationControls: React.FC = () => {
  const { dispatch } = useNotificationContext();

  const handleAdd = (message: string, notificationType: NotificationType): void => {
    dispatch({
      type: "ADD_NOTIFICATION",
      message,
      notificationType,
    });
  };

  return (
    <div>
      <h4>Trigger Notifications</h4>
      <button type="button" onClick={() => handleAdd("Operation completed successfully!", "success")}>
        Add Success Toast
      </button>
      <button type="button" onClick={() => handleAdd("System warning: Check your connections.", "warning")}>
        Add Warning Toast
      </button>
      <button type="button" onClick={() => handleAdd("New message received.", "info")}>
        Add Info Toast
      </button>
      <button type="button" onClick={() => dispatch({ type: "CLEAR_ALL" })}>
        Clear All
      </button>
    </div>
  );
};

export const NotificationList: React.FC = () => {
  const { state, dispatch } = useNotificationContext();

  if (state.notifications.length === 0) {
    return <p>No active notifications.</p>;
  }

  return (
    <div>
      <h4>Active Notifications ({state.notifications.length})</h4>
      <ul>
        {state.notifications.map((item) => (
          <li key={item.id}>
            <span>
              [{item.type.toUpperCase()}] {item.message}
            </span>{" "}
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "REMOVE_NOTIFICATION",
                  id: item.id,
                })
              }
            >
              Dismiss
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Main Container Component
// ---------------------------------------------------------------------

export const ContextWithReducerContainer: React.FC = () => {
  return (
    <NotificationProvider>
      <div>
        <h1>27 - Context with Reducer</h1>

        <h2>1. Global Application State via Context and Reducer Integration</h2>
        <NotificationControls />
        <NotificationList />
      </div>
    </NotificationProvider>
  );
};

export default ContextWithReducerContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Pairing useReducer with Context creates an architectural pattern for global/sub-tree state.
// - Reducers centralize transition math, keeping UI components pure and presentational.
// - Context distributes state and dispatch functions without passing props through intermediate layers.
// - Memoizing provider context values prevents unnecessary re-renders across consumers.
// - Strongly-typed action unions prevent state structure bugs across multi-file architectures.
