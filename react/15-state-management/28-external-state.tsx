/**
 * External State
 * ==============
 *
 * External state management involves storing application state outside of the React component tree.
 * Storing state externally allows data to persist across component unmounts, share values seamlessly
 * with non-React modules, and bypass standard React re-render cycles when updates occur.
 *
 * Integrating external state stores with React components requires an explicit subscription mechanism
 * to trigger re-renders whenever the external store updates, ensuring the UI stays synchronized with
 * the underlying store snapshot.
 */

import React, { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NetworkStatus {
  readonly isOnline: boolean;
}

export interface NetworkStatusViewerProps {
  readonly isOnline: boolean;
}

// ---------------------------------------------------------------------
// 2. External Store Implementation
// ---------------------------------------------------------------------

class NetworkStore {
  private isOnline: boolean = navigator.onLine;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline);
      window.addEventListener("offline", this.handleOffline);
    }
  }

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  public getSnapshot = (): boolean => {
    return this.isOnline;
  };

  private handleOnline = (): void => {
    this.isOnline = true;
    this.notify();
  };

  private handleOffline = (): void => {
    this.isOnline = false;
    this.notify();
  };

  private notify = (): void => {
    this.listeners.forEach((listener) => listener());
  };
}

export const networkStore = new NetworkStore();

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const NetworkStatusViewer: React.FC = () => {
  // Subscribe to external store snapshot using useSyncExternalStore
  const isOnline = useSyncExternalStore(networkStore.subscribe, networkStore.getSnapshot);

  return (
    <div>
      <h4>Network Connectivity Status</h4>
      <p>
        Status: <strong>{isOnline ? "Online" : "Offline"}</strong>
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ExternalStateContainer: React.FC = () => {
  return (
    <div>
      <h1>28 - External State</h1>

      <h2>1. Subscribing to External Non-React State Stores via useSyncExternalStore</h2>
      <NetworkStatusViewer />
    </div>
  );
};

export default ExternalStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - External state stores exist independently outside of the React component rendering tree.
// - Subscribing to external stores requires notification mechanisms when underlying state updates.
// - useSyncExternalStore synchronizes external store snapshots cleanly with React component state.
// - External state stores facilitate sharing state with non-React libraries and service layers.
// - Synchronizing external stores prevents tearing and race conditions during concurrent renders.
