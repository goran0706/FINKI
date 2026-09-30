/**
 * Server State Synchronization
 * ============================
 *
 * Server-state synchronization is the process of keeping client-side representations of remote
 * server data aligned with the current state of the server. Because server data can change outside
 * the current component, cached data can become stale even when the UI itself has not changed.
 *
 * Synchronization can happen through refetching, invalidation, polling, reconnect behavior, focus
 * events, mutations, or other application-specific mechanisms. The client does not own the server
 * state; it maintains a representation that must periodically be reconciled with the source of truth.
 *
 * Synchronization also requires handling differences between the cached representation and the
 * latest server response. A successful synchronization replaces or updates the cached representation,
 * while a failed synchronization can leave previously usable data available alongside an error state.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly version: number;
}

export interface ServerState<TData> {
  readonly data: TData;
  readonly version: number;
}

export interface SynchronizationState<TData> {
  readonly data: TData | null;
  readonly isSynchronizing: boolean;
  readonly isError: boolean;
  readonly lastSynchronizedVersion: number | null;
}

export interface SynchronizationExampleProps {
  readonly clientUser: User;
  readonly serverUser: User;
  readonly isSynchronizing: boolean;
}

export interface VersionComparisonProps {
  readonly clientVersion: number;
  readonly serverVersion: number;
}

export interface SynchronizationResultProps {
  readonly user: User;
  readonly isSynchronizing: boolean;
  readonly isError: boolean;
}

export interface FailedSynchronizationProps {
  readonly user: User;
  readonly isError: boolean;
  readonly isSynchronizing: boolean;
}

export interface SynchronizationControlsProps {
  readonly isSynchronizing: boolean;
  readonly onSynchronize: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SynchronizationExample: FC<SynchronizationExampleProps> = ({
  clientUser,
  serverUser,
  isSynchronizing,
}): ReactElement => {
  const isSynchronized: boolean = clientUser.version === serverUser.version;

  return (
    <div>
      <p>
        Client: {clientUser.name} — {clientUser.role}
      </p>
      <p>
        Server: {serverUser.name} — {serverUser.role}
      </p>
      <p>State: {isSynchronizing ? "synchronizing" : isSynchronized ? "synchronized" : "out of sync"}</p>
    </div>
  );
};

export const VersionComparison: FC<VersionComparisonProps> = ({ clientVersion, serverVersion }): ReactElement => {
  const isCurrent: boolean = clientVersion === serverVersion;
  const isBehind: boolean = clientVersion < serverVersion;

  return (
    <div>
      <p>Client version: {clientVersion}</p>
      <p>Server version: {serverVersion}</p>
      <p>
        Client state:{" "}
        {isCurrent ? "current" : isBehind ? "behind the server" : "different from the current server version"}
      </p>
      <p>A version difference indicates that the cached representation may need synchronization.</p>
    </div>
  );
};

export const SynchronizationResult: FC<SynchronizationResultProps> = ({
  user,
  isSynchronizing,
  isError,
}): ReactElement => {
  if (isSynchronizing) {
    return (
      <div>
        <p>Showing cached data for {user.name}.</p>
        <p>Synchronizing with the server...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Synchronization failed.</p>
        <p>
          Previously available data: {user.name} — {user.role}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Synchronized data: {user.name} — {user.role}
      </p>
      <p>Client representation matches the latest server response.</p>
    </div>
  );
};

export const FailedSynchronization: FC<FailedSynchronizationProps> = ({
  user,
  isError,
  isSynchronizing,
}): ReactElement => {
  return (
    <div>
      <p>Current cached value: {user.role}</p>
      <p>
        {isSynchronizing
          ? "A synchronization request is in progress."
          : isError
            ? "The latest synchronization failed; cached data remains available."
            : "No synchronization error exists."}
      </p>
    </div>
  );
};

export const SynchronizationControls: FC<SynchronizationControlsProps> = ({
  isSynchronizing,
  onSynchronize,
}): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onSynchronize} disabled={isSynchronizing}>
        {isSynchronizing ? "Synchronizing..." : "Synchronize server state"}
      </button>
      <p>Synchronization explicitly reconciles the client representation with the current server representation.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ServerStateSynchronization: FC = (): ReactElement => {
  const [serverUser, setServerUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
    version: 1,
  });
  const [clientUser, setClientUser] = useState<User>(serverUser);
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [lastSynchronizedVersion, setLastSynchronizedVersion] = useState<number>(1);

  const changeServerState = (): void => {
    setServerUser((currentUser: User): User => ({
      ...currentUser,
      role: "Senior Developer",
      version: currentUser.version + 1,
    }));
  };

  const synchronize = (): void => {
    if (isSynchronizing) {
      return;
    }

    setIsSynchronizing(true);
    setIsError(false);

    window.setTimeout((): void => {
      setClientUser(serverUser);
      setLastSynchronizedVersion(serverUser.version);
      setIsSynchronizing(false);
    }, 900);
  };

  const synchronizeWithError = (): void => {
    if (isSynchronizing) {
      return;
    }

    setIsSynchronizing(true);
    setIsError(false);

    window.setTimeout((): void => {
      setIsSynchronizing(false);
      setIsError(true);
    }, 900);
  };

  const reset = (): void => {
    const initialUser: User = {
      id: 1,
      name: "John Doe",
      role: "Developer",
      version: 1,
    };

    setServerUser(initialUser);
    setClientUser(initialUser);
    setIsSynchronizing(false);
    setIsError(false);
    setLastSynchronizedVersion(1);
  };

  const synchronizationState: SynchronizationState<User> = {
    data: clientUser,
    isSynchronizing,
    isError,
    lastSynchronizedVersion,
  };

  return (
    <main>
      <h1>Server State Synchronization</h1>

      <section>
        <h2>1. Client and Server Representations</h2>
        <SynchronizationExample clientUser={clientUser} serverUser={serverUser} isSynchronizing={isSynchronizing} />
        <button type="button" onClick={changeServerState} disabled={isSynchronizing}>
          Change server state
        </button>
      </section>

      <section>
        <h2>2. Detecting a Version Difference</h2>
        <VersionComparison clientVersion={clientUser.version} serverVersion={serverUser.version} />
      </section>

      <section>
        <h2>3. Successful Synchronization</h2>
        <SynchronizationResult
          user={synchronizationState.data ?? clientUser}
          isSynchronizing={synchronizationState.isSynchronizing}
          isError={synchronizationState.isError}
        />
        <SynchronizationControls isSynchronizing={isSynchronizing} onSynchronize={synchronize} />
      </section>

      <section>
        <h2>4. Failed Synchronization</h2>
        <FailedSynchronization user={clientUser} isError={isError} isSynchronizing={isSynchronizing} />
        <button type="button" onClick={synchronizeWithError} disabled={isSynchronizing}>
          Simulate synchronization failure
        </button>
      </section>

      <section>
        <h2>5. Last Synchronized Version</h2>
        <p>Last synchronized version: {lastSynchronizedVersion}</p>
        <p>Current server version: {serverUser.version}</p>
        <p>
          {lastSynchronizedVersion === serverUser.version
            ? "The client is synchronized with the server."
            : "The client has not yet synchronized with the latest server version."}
        </p>
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default ServerStateSynchronization;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Server-state synchronization keeps a client representation aligned with remote server data.
// The server remains the source of truth for server-owned state.
// Cached data can become outdated even when the component itself has not changed.
// Synchronization can occur through refetching, invalidation, polling, reconnect events, or mutations.
// A client can display existing data while a synchronization request is in progress.
// A successful synchronization updates the client representation with newer server data.
// A failed synchronization does not necessarily require previously usable cached data to be removed.
// Version or timestamp information can help identify whether a representation is behind the server.
// Synchronization is an ongoing process because server state can change independently of the client.
