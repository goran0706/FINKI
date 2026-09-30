/**
 * History API
 * ============
 *
 * The browser History API provides JavaScript methods for creating and changing entries in the
 * browser's session history. Client-side routers use these browser capabilities to change the
 * URL and navigate through application locations without performing a full document navigation.
 *
 * history.pushState() adds a new history entry, while history.replaceState() changes the current
 * history entry without adding another one. The popstate event is emitted when the active history
 * entry changes through browser history traversal, such as Back and Forward navigation.
 *
 * pushState() and replaceState() change the URL and history state without automatically causing a
 * page reload. They also do not trigger a popstate event themselves. Applications that use the
 * History API directly therefore need to update their UI when they call these methods and listen
 * for popstate when the user traverses existing history entries.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";

export interface HistoryState {
  readonly page: string;
  readonly timestamp: number;
}

export interface HistoryNavigationProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PushStateExample: FC<HistoryNavigationProps> = ({ title }: HistoryNavigationProps): ReactElement => {
  const [locationPath, setLocationPath] = useState<string>(window.location.pathname);

  const navigate = (path: string): void => {
    const state: HistoryState = {
      page: path,
      timestamp: Date.now(),
    };

    window.history.pushState(state, "", path);

    setLocationPath(path);
  };

  return (
    <article>
      <h3>{title}</h3>
      <p>Current path: {locationPath}</p>
      <button
        type="button"
        onClick={(): void => {
          navigate("/products");
        }}
      >
        Push /products
      </button>
      <button
        type="button"
        onClick={(): void => {
          navigate("/profile");
        }}
      >
        Push /profile
      </button>
      <p>pushState adds a new history entry and changes the URL without reloading the document.</p>
    </article>
  );
};

export const ReplaceStateExample: FC<HistoryNavigationProps> = ({ title }: HistoryNavigationProps): ReactElement => {
  const [locationPath, setLocationPath] = useState<string>(window.location.pathname);

  const replaceLocation = (): void => {
    const state: HistoryState = {
      page: "/account",
      timestamp: Date.now(),
    };

    window.history.replaceState(state, "", "/account");

    setLocationPath("/account");
  };

  return (
    <article>
      <h3>{title}</h3>
      <p>Current path: {locationPath}</p>
      <button type="button" onClick={replaceLocation}>
        Replace With /account
      </button>
      <p>replaceState changes the current history entry instead of creating an additional entry.</p>
    </article>
  );
};

export const PopStateExample: FC<HistoryNavigationProps> = ({ title }: HistoryNavigationProps): ReactElement => {
  const [locationPath, setLocationPath] = useState<string>(window.location.pathname);

  useEffect((): (() => void) => {
    const handlePopState = (): void => {
      setLocationPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return (): void => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <article>
      <h3>{title}</h3>
      <p>Current path: {locationPath}</p>
      <p>The popstate event runs when the active history entry changes through browser history traversal.</p>
      <p>Use the browser Back or Forward controls after creating history entries to observe the location update.</p>
    </article>
  );
};

export const HistoryStateExample: FC<HistoryNavigationProps> = ({ title }: HistoryNavigationProps): ReactElement => {
  const [stateDescription, setStateDescription] = useState<string>("No custom history state selected.");

  const storeHistoryState = (): void => {
    const state: HistoryState = {
      page: "/settings",
      timestamp: Date.now(),
    };

    window.history.pushState(state, "", "/settings");

    setStateDescription(`Stored page: ${state.page}`);
  };

  return (
    <article>
      <h3>{title}</h3>
      <p>{stateDescription}</p>
      <button type="button" onClick={storeHistoryState}>
        Store History State
      </button>
      <p>The first argument of pushState and replaceState stores application-defined data with the history entry.</p>
    </article>
  );
};

export const HistoryApiMisconceptionExample: FC<HistoryNavigationProps> = ({
  title,
}: HistoryNavigationProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        Calling pushState or replaceState changes the browser history and URL, but it does not automatically render
        different React UI.
      </p>
      <p>
        An application must connect location changes to its rendering logic. A router provides this coordination for a
        complete routing system.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HistoryApiDemo: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. pushState Adds a History Entry</h2>
      <PushStateExample title="pushState" />

      <h2>2. replaceState Replaces the Current Entry</h2>
      <ReplaceStateExample title="replaceState" />

      <h2>3. popstate Observes History Traversal</h2>
      <PopStateExample title="popstate" />

      <h2>4. History Entries Can Store Application State</h2>
      <HistoryStateExample title="History State" />

      <h2>5. The History API Does Not Render React UI</h2>
      <HistoryApiMisconceptionExample title="History API and Rendering" />
    </main>
  );
};

export default HistoryApiDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// The History API allows JavaScript to manipulate the browser's session history.
// pushState adds a new history entry without performing a document reload.
// replaceState changes the current history entry without adding another entry.
// Both methods can associate application-defined state data with a history entry.
// Neither pushState nor replaceState automatically emits a popstate event.
// popstate runs when the active history entry changes through browser history traversal.
// Direct History API usage must coordinate URL changes with application rendering.
// Client-side routers build higher-level navigation behavior on top of browser history capabilities.
