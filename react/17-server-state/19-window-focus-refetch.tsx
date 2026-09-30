/**
 * Window Focus Refetch
 * ====================
 *
 * Window focus refetching is a server-state synchronization mechanism that can trigger a query
 * refetch when the application becomes visible or regains focus after the user has interacted with
 * another application, browser tab, or window.
 *
 * The purpose is to reduce the amount of time that cached server data remains out of date while
 * avoiding continuous requests while the application is actively being viewed. Query libraries can
 * combine this behavior with query freshness rules, so returning to the application does not
 * necessarily mean that every query must always make a network request.
 *
 * A focus-triggered refetch normally occurs only for queries that are eligible to refetch. Existing
 * data can remain visible while the request is in progress, making window-focus refetching a form
 * of background synchronization rather than an initial loading operation.
 */

import type { FC } from "react";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
}

export interface FocusQueryState<TData> {
  readonly data: TData | null;
  readonly isFetching: boolean;
  readonly lastUpdated: number | null;
}

export interface WindowFocusState {
  readonly isFocused: boolean;
  readonly focusCount: number;
}

export interface FocusRefetchExampleProps {
  readonly user: User;
  readonly isFetching: boolean;
  readonly focusCount: number;
}

export interface FocusIndicatorProps {
  readonly isFocused: boolean;
}

export interface StaleOnFocusProps {
  readonly user: User;
  readonly isFetching: boolean;
  readonly lastUpdated: number | null;
}

export interface FocusRefetchControlProps {
  readonly enabled: boolean;
  readonly isFetching: boolean;
  readonly onRefetch: () => void;
}

export interface FocusErrorProps {
  readonly user: User;
  readonly isFetching: boolean;
  readonly isError: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const WindowFocusRefetchExample: FC<FocusRefetchExampleProps> = ({
  user,
  isFetching,
  focusCount,
}): React.ReactElement => {
  return (
    <div>
      <p>
        {user.name} — {user.role}
      </p>
      <p>Window focus events observed: {focusCount}</p>
      <p>Query status: {isFetching ? "refetching in the background" : "idle"}</p>
    </div>
  );
};

export const FocusIndicator: FC<FocusIndicatorProps> = ({ isFocused }): React.ReactElement => {
  return (
    <div>
      <p>Application visibility: {isFocused ? "visible" : "not visible"}</p>
      <p>
        {isFocused
          ? "The application can respond to focus or visibility changes."
          : "The application is currently outside the active view."}
      </p>
    </div>
  );
};

export const StaleDataOnFocus: FC<StaleOnFocusProps> = ({ user, isFetching, lastUpdated }): React.ReactElement => {
  const updatedText: string = lastUpdated === null ? "never" : new Date(lastUpdated).toLocaleTimeString();

  return (
    <div>
      <p>
        {user.name} — {user.role}
      </p>
      <p>Last synchronized: {updatedText}</p>
      <p>
        {isFetching
          ? "Refreshing because the query is being synchronized."
          : "Existing server data is currently displayed."}
      </p>
    </div>
  );
};

export const FocusRefetchControl: FC<FocusRefetchControlProps> = ({
  enabled,
  isFetching,
  onRefetch,
}): React.ReactElement => {
  return (
    <div>
      <p>Focus refetch behavior: {enabled ? "enabled" : "disabled"}</p>
      <button type="button" onClick={onRefetch} disabled={!enabled || isFetching}>
        {isFetching ? "Refetching..." : "Simulate focus refetch"}
      </button>
      <p>
        Disabling focus refetch means regaining application focus does not automatically start this synchronization
        request.
      </p>
    </div>
  );
};

export const FocusRefetchError: FC<FocusErrorProps> = ({ user, isFetching, isError }): React.ReactElement => {
  if (isFetching) {
    return (
      <div>
        <p>Existing data: {user.name}</p>
        <p>Focus-triggered refetch is in progress...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Focus-triggered refetch failed.</p>
        <p>Previously available data: {user.name}</p>
        <p>A failed refetch does not necessarily remove the previously cached data.</p>
      </div>
    );
  }

  return <p>No focus-refetch error.</p>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const WindowFocusRefetch: FC = (): React.ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
  });
  const [isFocused, setIsFocused] = useState<boolean>(document.visibilityState === "visible");
  const [focusCount, setFocusCount] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const [focusRefetchEnabled, setFocusRefetchEnabled] = useState<boolean>(true);

  const refetch = (): void => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setUser((currentUser: User): User => ({
        ...currentUser,
        role: "Senior Developer",
      }));
      setLastUpdated(Date.now());
      setIsFetching(false);
    }, 900);
  };

  const refetchWithError = (): void => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setIsFetching(false);
      setIsError(true);
    }, 900);
  };

  useEffect((): (() => void) => {
    const handleVisibilityChange = (): void => {
      const visible: boolean = document.visibilityState === "visible";

      setIsFocused(visible);

      if (visible) {
        setFocusCount((count: number): number => count + 1);

        if (focusRefetchEnabled) {
          refetch();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return (): void => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [focusRefetchEnabled, isFetching]);

  const toggleFocusRefetch = (): void => {
    setFocusRefetchEnabled((enabled: boolean): boolean => !enabled);
  };

  const reset = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
      role: "Developer",
    });
    setIsFetching(false);
    setIsError(false);
    setFocusCount(0);
    setLastUpdated(Date.now());
    setFocusRefetchEnabled(true);
  };

  return (
    <main>
      <h1>Window Focus Refetch</h1>

      <section>
        <h2>1. Refetch on Window Visibility</h2>
        <WindowFocusRefetchExample user={user} isFetching={isFetching} focusCount={focusCount} />
      </section>

      <section>
        <h2>2. Window Focus State</h2>
        <FocusIndicator isFocused={isFocused} />
      </section>

      <section>
        <h2>3. Existing Data During Focus Refetch</h2>
        <StaleDataOnFocus user={user} isFetching={isFetching} lastUpdated={lastUpdated} />
      </section>

      <section>
        <h2>4. Enabling and Disabling Focus Refetch</h2>
        <FocusRefetchControl enabled={focusRefetchEnabled} isFetching={isFetching} onRefetch={refetch} />
        <button type="button" onClick={toggleFocusRefetch}>
          {focusRefetchEnabled ? "Disable focus refetch" : "Enable focus refetch"}
        </button>
      </section>

      <section>
        <h2>5. Focus Refetch Error</h2>
        <FocusRefetchError user={user} isFetching={isFetching} isError={isError} />
        <button type="button" onClick={refetchWithError} disabled={isFetching}>
          Simulate focus refetch error
        </button>
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default WindowFocusRefetch;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Window-focus refetching synchronizes eligible server-state queries when the application becomes visible.
// The application can detect visibility changes through the browser's `visibilitychange` event.
// Existing query data can remain visible while the focus-triggered request is in progress.
// Focus refetching is commonly associated with stale queries rather than unconditional network requests.
// Focus refetch behavior can be enabled or disabled through query configuration.
// A failed focus-triggered refetch does not inherently require previously cached data to be discarded.
// Focus refetching is a background synchronization mechanism, not the same thing as initial loading.
