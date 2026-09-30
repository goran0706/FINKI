/**
 * Cross-Tab Synchronization
 * ==========================
 *
 * Cross-tab synchronization keeps server-state-related client representations aligned across
 * multiple browser tabs or windows that belong to the same origin. Each tab has its own JavaScript
 * runtime and React state, so changing state in one tab does not automatically update another tab.
 *
 * Browser communication mechanisms such as the BroadcastChannel API and the `storage` event can
 * distribute synchronization messages between same-origin browsing contexts. A receiving tab can
 * then invalidate, refetch, or directly reconcile its local representation of server state.
 *
 * Cross-tab synchronization does not make React state global. Each tab still owns its own React
 * state; the synchronization mechanism only provides a communication channel between those
 * independent runtimes.
 *
 * A synchronization message should describe an event or state change rather than assume that the
 * receiving tab has the exact same in-memory state. Real applications commonly use these messages
 * to trigger cache invalidation or refetching, allowing the server to remain the authoritative
 * source of truth.
 */

import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly version: number;
}

export interface SynchronizationMessage {
  readonly type: "user-updated" | "user-deleted" | "cache-invalidated";
  readonly resourceId: number;
  readonly version: number;
}

export interface TabState {
  readonly tabName: string;
  readonly user: User | null;
  readonly isSynchronizing: boolean;
  readonly lastMessage: SynchronizationMessage | null;
}

export interface CrossTabMessageProps {
  readonly message: SynchronizationMessage;
}

export interface TabStateDisplayProps {
  readonly state: TabState;
}

export interface BroadcastChannelExampleProps {
  readonly channelName: string;
}

export interface StorageEventExampleProps {
  readonly storageKey: string;
}

export interface CrossTabControlsProps {
  readonly onUpdateUser: () => void;
  readonly onDeleteUser: () => void;
  readonly onInvalidateCache: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CrossTabMessage: FC<CrossTabMessageProps> = ({ message }): ReactElement => {
  return (
    <div>
      <p>Message type: {message.type}</p>
      <p>Resource ID: {message.resourceId}</p>
      <p>Server version: {message.version}</p>
    </div>
  );
};

export const TabStateDisplay: FC<TabStateDisplayProps> = ({ state }): ReactElement => {
  return (
    <div>
      <p>Tab: {state.tabName}</p>
      <p>User: {state.user === null ? "No user" : `${state.user.name} (${state.user.role})`}</p>
      <p>Version: {state.user?.version ?? "—"}</p>
      <p>Synchronizing: {state.isSynchronizing ? "Yes" : "No"}</p>
      <p>Last message: {state.lastMessage === null ? "None" : state.lastMessage.type}</p>
    </div>
  );
};

export const BroadcastChannelExample: FC<BroadcastChannelExampleProps> = ({ channelName }): ReactElement => {
  const [receivedMessage, setReceivedMessage] = useState<SynchronizationMessage | null>(null);

  useEffect((): (() => void) | undefined => {
    if (typeof BroadcastChannel === "undefined") {
      return undefined;
    }

    const channel: BroadcastChannel = new BroadcastChannel(channelName);

    const handleMessage = (event: MessageEvent<SynchronizationMessage>): void => {
      setReceivedMessage(event.data);
    };

    channel.addEventListener("message", handleMessage);

    return (): void => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [channelName]);

  return (
    <div>
      <p>BroadcastChannel is used when same-origin tabs need a direct messaging channel.</p>
      <p>Received message: {receivedMessage === null ? "None" : receivedMessage.type}</p>
    </div>
  );
};

export const StorageEventExample: FC<StorageEventExampleProps> = ({ storageKey }): ReactElement => {
  const [receivedValue, setReceivedValue] = useState<string | null>(null);

  useEffect((): (() => void) => {
    const handleStorage = (event: StorageEvent): void => {
      if (event.key === storageKey) {
        setReceivedValue(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);

    return (): void => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [storageKey]);

  return (
    <div>
      <p>The storage event notifies other same-origin tabs when localStorage is changed.</p>
      <p>Received value: {receivedValue ?? "None"}</p>
    </div>
  );
};

export const CrossTabControls: FC<CrossTabControlsProps> = ({
  onUpdateUser,
  onDeleteUser,
  onInvalidateCache,
}): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onUpdateUser}>
        Broadcast User Update
      </button>
      <button type="button" onClick={onDeleteUser}>
        Broadcast User Deletion
      </button>
      <button type="button" onClick={onInvalidateCache}>
        Broadcast Cache Invalidation
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CrossTabSynchronization = (): ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
    version: 1,
  });
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<SynchronizationMessage | null>(null);

  const channelName: string = "server-state-synchronization";
  const storageKey: string = "server-state-sync-event";

  useEffect((): (() => void) | undefined => {
    if (typeof BroadcastChannel === "undefined") {
      return undefined;
    }

    const channel: BroadcastChannel = new BroadcastChannel(channelName);

    const handleMessage = (event: MessageEvent<SynchronizationMessage>): void => {
      const message: SynchronizationMessage = event.data;

      setLastMessage(message);

      if (message.resourceId !== user.id) {
        return;
      }

      setIsSynchronizing(true);

      window.setTimeout((): void => {
        if (message.type === "user-deleted") {
          setUser(null);
        }

        if (message.type === "user-updated") {
          setUser((currentUser: User | null): User | null => {
            if (currentUser === null || message.version <= currentUser.version) {
              return currentUser;
            }

            return {
              ...currentUser,
              version: message.version,
            };
          });
        }

        setIsSynchronizing(false);
      }, 500);
    };

    channel.addEventListener("message", handleMessage);

    return (): void => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [channelName, user.id]);

  const broadcastMessage = (message: SynchronizationMessage): void => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const channel: BroadcastChannel = new BroadcastChannel(channelName);

    channel.postMessage(message);
    channel.close();

    setLastMessage(message);
  };

  const updateUser = (): void => {
    setUser((currentUser: User | null): User | null => {
      if (currentUser === null) {
        return currentUser;
      }

      return {
        ...currentUser,
        role: currentUser.role === "Developer" ? "Admin" : "Developer",
        version: currentUser.version + 1,
      };
    });

    const nextVersion: number = user.version + 1;

    broadcastMessage({
      type: "user-updated",
      resourceId: user.id,
      version: nextVersion,
    });
  };

  const deleteUser = (): void => {
    broadcastMessage({
      type: "user-deleted",
      resourceId: user.id,
      version: user.version + 1,
    });

    setUser(null);
  };

  const invalidateCache = (): void => {
    broadcastMessage({
      type: "cache-invalidated",
      resourceId: user.id,
      version: user.version,
    });
  };

  const reset = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
      role: "Developer",
      version: 1,
    });
    setIsSynchronizing(false);
    setLastMessage(null);
  };

  const tabState: TabState = {
    tabName: "Current Tab",
    user,
    isSynchronizing,
    lastMessage,
  };

  const exampleMessage: SynchronizationMessage = {
    type: "user-updated",
    resourceId: 1,
    version: 2,
  };

  return (
    <main>
      <h1>Cross-Tab Synchronization</h1>

      <h2>1. Synchronization Messages</h2>
      <CrossTabMessage message={exampleMessage} />

      <h2>2. Independent Tab State</h2>
      <TabStateDisplay state={tabState} />

      <h2>3. BroadcastChannel</h2>
      <BroadcastChannelExample channelName={channelName} />

      <h2>4. localStorage Storage Events</h2>
      <StorageEventExample storageKey={storageKey} />

      <h2>5. Cross-Tab Synchronization Controls</h2>
      <CrossTabControls onUpdateUser={updateUser} onDeleteUser={deleteUser} onInvalidateCache={invalidateCache} />

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default CrossTabSynchronization;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Cross-tab synchronization allows independent browser tabs to communicate about server-state changes.
// Each tab still owns its own React state; synchronization mechanisms only distribute change notifications.
// BroadcastChannel provides direct same-origin tab messaging through named communication channels.
// The localStorage storage event can also notify other same-origin tabs when a storage value changes.
// Synchronization messages commonly trigger invalidation or refetching rather than directly replacing local data.
// Version information can help a receiving tab ignore older messages and avoid applying stale updates.
// Event listeners and BroadcastChannel instances must be cleaned up when a component unmounts.
// Cross-tab synchronization is communication between client runtimes; the server remains the authoritative source of truth.
