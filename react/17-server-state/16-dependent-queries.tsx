/**
 * Dependent Queries
 * =================
 *
 * A dependent query is a server-state query whose execution depends on data returned by another
 * query. The dependent query cannot begin with the required parameters until the prerequisite
 * query has successfully resolved and produced those parameters.
 *
 * Dependent queries therefore create an explicit request dependency: the first query establishes
 * the input required by the second query. This differs from parallel queries, where independent
 * requests can start at the same time because neither request needs the result of the other.
 *
 * A dependent query commonly represents relationships such as user -> projects, account -> settings,
 * or organization -> members. In a query library, the dependent query is typically disabled until
 * its required input exists, often by deriving an `enabled` condition from the prerequisite query.
 */

import type { FC } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface Project {
  readonly id: number;
  readonly name: string;
  readonly ownerId: number;
}

export interface QueryState<TData> {
  readonly data: TData | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly isError: boolean;
}

export interface DependentQueryExampleProps {
  readonly user: User | null;
}

export interface BasicDependencyProps {
  readonly prerequisiteAvailable: boolean;
}

export interface DependentQueryLifecycleProps {
  readonly user: User | null;
  readonly projects: readonly Project[];
  readonly isLoadingProjects: boolean;
}

export interface MissingDependencyProps {
  readonly user: User | null;
}

export interface DependentQueryErrorProps {
  readonly user: User;
  readonly hasError: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicDependentQuery: FC<DependentQueryExampleProps> = ({ user }): React.ReactElement => {
  const isProjectsQueryEnabled: boolean = user !== null;

  return (
    <div>
      <p>Prerequisite user: {user?.name ?? "not loaded"}</p>
      <p>Projects query: {isProjectsQueryEnabled ? "enabled" : "disabled"}</p>
    </div>
  );
};

export const DependencyControlsQuery: FC<BasicDependencyProps> = ({ prerequisiteAvailable }): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const startDependentQuery = (): void => {
    if (!prerequisiteAvailable) {
      return;
    }

    setIsLoading(true);
    setHasStarted(true);

    window.setTimeout((): void => {
      setIsLoading(false);
    }, 700);
  };

  return (
    <div>
      <p>Prerequisite available: {prerequisiteAvailable ? "yes" : "no"}</p>
      <button type="button" onClick={startDependentQuery} disabled={!prerequisiteAvailable || isLoading}>
        {isLoading ? "Loading projects..." : "Load projects"}
      </button>
      <p>
        Dependent query status:{" "}
        {!prerequisiteAvailable
          ? "waiting for prerequisite"
          : isLoading
            ? "fetching"
            : hasStarted
              ? "success"
              : "ready"}
      </p>
    </div>
  );
};

export const DependentQueryLifecycle: FC<DependentQueryLifecycleProps> = ({
  user,
  projects,
  isLoadingProjects,
}): React.ReactElement => {
  const hasUser: boolean = user !== null;
  const isProjectsQueryEnabled: boolean = hasUser;

  return (
    <div>
      <p>User query: {hasUser ? "success" : "loading"}</p>
      <p>Projects query: {!isProjectsQueryEnabled ? "disabled" : isLoadingProjects ? "loading" : "success"}</p>
      {projects.length > 0 && (
        <ul>
          {projects.map((project: Project): React.ReactElement => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MissingDependency: FC<MissingDependencyProps> = ({ user }): React.ReactElement => {
  const projectQueryKey: readonly [string, number | undefined] = ["projects", user?.id];
  const isEnabled: boolean = user !== null;

  return (
    <div>
      <p>
        Query key: [{projectQueryKey[0]}, {projectQueryKey[1] ?? "undefined"}]
      </p>
      <p>Enabled: {isEnabled ? "yes" : "no"}</p>
      <p>
        {isEnabled
          ? "The user ID is available, so the projects query can run."
          : "The user ID is missing, so the projects query must remain disabled."}
      </p>
    </div>
  );
};

export const DependentQueryError: FC<DependentQueryErrorProps> = ({ user, hasError }): React.ReactElement => {
  const isEnabled: boolean = user !== null;

  if (!isEnabled) {
    return <p>Projects query is disabled because the user is unavailable.</p>;
  }

  if (hasError) {
    return (
      <div>
        <p>Projects query failed.</p>
        <button type="button">Retry projects query</button>
      </div>
    );
  }

  return <p>Projects query succeeded for {user.name}.</p>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const DependentQueries: FC = (): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
  const [projects, setProjects] = useState<readonly Project[]>([]);
  const [hasProjectError, setHasProjectError] = useState<boolean>(false);

  const loadUser = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
    });
  };

  const loadProjects = (): void => {
    if (user === null) {
      return;
    }

    setIsLoadingProjects(true);
    setHasProjectError(false);

    window.setTimeout((): void => {
      setProjects([
        {
          id: 101,
          name: "Website Redesign",
          ownerId: user.id,
        },
        {
          id: 102,
          name: "Mobile Application",
          ownerId: user.id,
        },
      ]);
      setIsLoadingProjects(false);
    }, 700);
  };

  const simulateProjectError = (): void => {
    if (user === null) {
      return;
    }

    setIsLoadingProjects(true);

    window.setTimeout((): void => {
      setHasProjectError(true);
      setIsLoadingProjects(false);
    }, 700);
  };

  const reset = (): void => {
    setUser(null);
    setProjects([]);
    setIsLoadingProjects(false);
    setHasProjectError(false);
  };

  return (
    <main>
      <h1>Dependent Queries</h1>

      <section>
        <h2>1. Basic Dependency</h2>
        <BasicDependentQuery user={user} />
        <button type="button" onClick={loadUser} disabled={user !== null}>
          Load user
        </button>
      </section>

      <section>
        <h2>2. Dependent Query Enablement</h2>
        <DependencyControlsQuery prerequisiteAvailable={user !== null} />
      </section>

      <section>
        <h2>3. Query Lifecycle</h2>
        <DependentQueryLifecycle user={user} projects={projects} isLoadingProjects={isLoadingProjects} />
        <button type="button" onClick={loadProjects} disabled={user === null || isLoadingProjects}>
          Load projects
        </button>
      </section>

      <section>
        <h2>4. Missing Dependency</h2>
        <MissingDependency user={user} />
      </section>

      <section>
        <h2>5. Dependent Query Error</h2>
        <DependentQueryError user={user ?? { id: 1, name: "John Doe" }} hasError={hasProjectError} />
        <button type="button" onClick={simulateProjectError} disabled={user === null || isLoadingProjects}>
          Simulate project error
        </button>
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default DependentQueries;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A dependent query waits for another query to provide the input it needs.
// The prerequisite query establishes the identifier or parameter required by the dependent query.
// The dependent query should remain disabled while that prerequisite data is unavailable.
// Once the dependency exists, the dependent query can execute using the resolved value.
// Dependent queries create sequential request dependencies rather than independent parallel requests.
// A missing dependency is different from a failed dependent request: the former prevents execution,
// while the latter occurs after the dependent query has actually started.
// Query libraries commonly express this relationship through an enabled condition derived from
// prerequisite query data, allowing the dependency to control when the second query can run.
