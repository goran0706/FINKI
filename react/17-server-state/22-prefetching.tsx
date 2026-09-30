/**
 * Prefetching
 * ===========
 *
 * Prefetching is the process of requesting server data before the application actually needs to
 * render that data. The purpose is to move network latency earlier so that a later navigation or
 * interaction can reuse data that has already been fetched.
 *
 * Prefetched data is commonly placed into the query cache under the same query identity that the
 * eventual query will use. When the user later requests that data, the query can read the cached
 * result instead of starting from an empty state, provided the cached data is still usable.
 *
 * Prefetching is different from rendering a query. A prefetched query can be fetched without
 * immediately displaying its result. It is therefore useful for predictable future interactions,
 * such as hovering a link, opening a menu, moving through a wizard, or anticipating navigation.
 *
 * Prefetching is also an optimization rather than a correctness requirement. The prefetched data
 * can become stale before it is used, the user may never request it, or the prefetch request may
 * fail. Applications should therefore avoid treating prefetched data as guaranteed.
 */

import type { FC } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
}

export interface Project {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

export interface CacheEntry<TData> {
  readonly data: TData | null;
  readonly isFetching: boolean;
  readonly isPrefetched: boolean;
}

export interface BasicPrefetchProps {
  readonly project: Project | null;
  readonly isPrefetching: boolean;
}

export interface PrefetchCacheProps {
  readonly project: Project | null;
  readonly isPrefetched: boolean;
}

export interface NavigationPrefetchProps {
  readonly project: Project | null;
  readonly isPrefetching: boolean;
  readonly onPrefetch: () => void;
  readonly onOpen: () => void;
}

export interface PrefetchFailureProps {
  readonly project: Project | null;
  readonly isPrefetching: boolean;
  readonly hasError: boolean;
  readonly onRetry: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicPrefetch: FC<BasicPrefetchProps> = ({ project, isPrefetching }): React.ReactElement => {
  return (
    <div>
      <p>
        {isPrefetching
          ? "Prefetching project data..."
          : project
            ? `Prefetched: ${project.name}`
            : "No project has been prefetched."}
      </p>
      <p>Prefetching requests data before the data is required for rendering.</p>
    </div>
  );
};

export const PrefetchCache: FC<PrefetchCacheProps> = ({ project, isPrefetched }): React.ReactElement => {
  return (
    <div>
      <p>Cache status: {isPrefetched ? "prefetched data available" : "empty"}</p>
      {project !== null && <p>Cached project: {project.name}</p>}
      <p>
        The eventual query can reuse prefetched data when it uses the same query identity and the cached data is still
        usable.
      </p>
    </div>
  );
};

export const NavigationPrefetch: FC<NavigationPrefetchProps> = ({
  project,
  isPrefetching,
  onPrefetch,
  onOpen,
}): React.ReactElement => {
  return (
    <div>
      <button type="button" onMouseEnter={onPrefetch} onFocus={onPrefetch} disabled={isPrefetching}>
        {isPrefetching ? "Preparing project..." : "Hover or focus to prefetch"}
      </button>
      <button type="button" onClick={onOpen}>
        Open project
      </button>
      <p>
        {project !== null
          ? `Cached project: ${project.name}`
          : "Move onto the control to simulate an anticipated navigation."}
      </p>
    </div>
  );
};

export const PrefetchFailure: FC<PrefetchFailureProps> = ({
  project,
  isPrefetching,
  hasError,
  onRetry,
}): React.ReactElement => {
  if (isPrefetching) {
    return <p>Prefetch request is in progress...</p>;
  }

  if (hasError) {
    return (
      <div>
        <p>Prefetch failed.</p>
        <p>
          A failed prefetch does not make the future query unusable. The application can retry or fetch the data when it
          is actually needed.
        </p>
        <button type="button" onClick={onRetry}>
          Retry prefetch
        </button>
      </div>
    );
  }

  return <p>{project !== null ? "Prefetch completed successfully." : "No prefetch failure has occurred."}</p>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const Prefetching: FC = (): React.ReactElement => {
  const [project, setProject] = useState<Project | null>(null);
  const [isPrefetching, setIsPrefetching] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const prefetchedProject: Project = {
    id: 101,
    name: "Website Redesign",
    description: "A redesigned public website.",
  };

  const prefetch = (): void => {
    if (isPrefetching || project !== null) {
      return;
    }

    setIsPrefetching(true);
    setHasError(false);

    window.setTimeout((): void => {
      setProject(prefetchedProject);
      setIsPrefetching(false);
    }, 800);
  };

  const openProject = (): void => {
    setIsOpen(true);
  };

  const prefetchWithError = (): void => {
    if (isPrefetching) {
      return;
    }

    setIsPrefetching(true);
    setHasError(false);

    window.setTimeout((): void => {
      setIsPrefetching(false);
      setHasError(true);
    }, 800);
  };

  const retryPrefetch = (): void => {
    setHasError(false);
    prefetch();
  };

  const reset = (): void => {
    setProject(null);
    setIsPrefetching(false);
    setHasError(false);
    setIsOpen(false);
  };

  return (
    <main>
      <h1>Prefetching</h1>

      <section>
        <h2>1. Basic Prefetch</h2>
        <BasicPrefetch project={project} isPrefetching={isPrefetching} />
        <button type="button" onClick={prefetch} disabled={isPrefetching || project !== null}>
          Prefetch project
        </button>
      </section>

      <section>
        <h2>2. Prefetched Data in the Cache</h2>
        <PrefetchCache project={project} isPrefetched={project !== null} />
      </section>

      <section>
        <h2>3. Prefetch Before Navigation</h2>
        <NavigationPrefetch
          project={project}
          isPrefetching={isPrefetching}
          onPrefetch={prefetch}
          onOpen={openProject}
        />
        {isOpen && (
          <p>
            Project view opened with{" "}
            {project !== null ? "prefetched data already available." : "no prefetched data available yet."}
          </p>
        )}
      </section>

      <section>
        <h2>4. Prefetch Failure</h2>
        <PrefetchFailure project={project} isPrefetching={isPrefetching} hasError={hasError} onRetry={retryPrefetch} />
        <button type="button" onClick={prefetchWithError} disabled={isPrefetching}>
          Simulate prefetch failure
        </button>
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default Prefetching;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Prefetching requests server data before that data is actually required for rendering.
// The main purpose is to reduce perceived latency during predictable future interactions.
// Prefetched data is commonly stored in the query cache under the future query's identity.
// A later query can reuse prefetched data when the cached result is still usable.
// Prefetching is an optimization and is not required for the correctness of the eventual query.
// Prefetched data can become stale before it is consumed.
// The user may never perform the interaction for which data was prefetched.
// A failed prefetch can be retried or followed by a normal request when the data is actually needed.
// Prefetching should therefore be treated as anticipatory server-state synchronization.
