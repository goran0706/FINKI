/**
 * Client State Normalization
 * ===========================
 *
 * State normalization is the practice of representing related entities in a structured form so
 * that each entity has one canonical copy and relationships are represented by identifiers.
 * Instead of deeply nesting duplicated objects, normalized state commonly separates entities into
 * collections indexed by ID and stores relationships using those IDs.
 *
 * Normalization is useful when multiple parts of the UI need to read or update the same entity.
 * Updating one canonical entity then makes the change available everywhere that references it,
 * avoiding inconsistent duplicated copies.
 *
 * A normalized state shape commonly contains an entity collection such as a Record keyed by ID
 * and separate arrays or collections containing relationships between entities. Normalization is
 * not required for every piece of client state; simple, shallow, or strictly local data may be
 * clearer when represented directly.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: string;
  readonly name: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
}

export interface NormalizedState {
  readonly users: Readonly<Record<string, User>>;
  readonly projects: Readonly<Record<string, Project>>;
  readonly projectIds: readonly string[];
}

export interface NormalizedStateExampleProps {
  readonly initialState: NormalizedState;
}

export interface EntityListProps {
  readonly users: Readonly<Record<string, User>>;
  readonly projects: Readonly<Record<string, Project>>;
  readonly projectIds: readonly string[];
}

export interface UpdateUserProps {
  readonly initialState: NormalizedState;
}

export interface StateShapeExampleProps {
  readonly title: string;
  readonly description: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const EntityList: FC<EntityListProps> = ({ users, projects, projectIds }): ReactElement => {
  return (
    <ul>
      {projectIds.map((projectId: string) => {
        const project: Project = projects[projectId];
        const owner: User | undefined = users[project.ownerId];

        return (
          <li key={project.id}>
            {project.name} — owner: {owner?.name ?? "Unknown"}
          </li>
        );
      })}
    </ul>
  );
};

export const NormalizedStateExample: FC<NormalizedStateExampleProps> = ({ initialState }): ReactElement => {
  const [state, setState] = useState<NormalizedState>(initialState);

  const renameUser = (): void => {
    const currentUser: User = state.users["user-1"];

    if (currentUser === undefined) {
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      name: currentUser.name === "John Doe" ? "Jane Doe" : "John Doe",
    };

    setState((currentState: NormalizedState): NormalizedState => ({
      ...currentState,
      users: {
        ...currentState.users,
        [updatedUser.id]: updatedUser,
      },
    }));
  };

  return (
    <div>
      <EntityList users={state.users} projects={state.projects} projectIds={state.projectIds} />
      <button type="button" onClick={renameUser}>
        Rename shared user
      </button>
    </div>
  );
};

export const NormalizedStateStructure: FC<StateShapeExampleProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const NormalizationBenefit: FC<StateShapeExampleProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ClientStateNormalizationDemo: FC = (): ReactElement => {
  const initialState: NormalizedState = {
    users: {
      "user-1": {
        id: "user-1",
        name: "John Doe",
      },
      "user-2": {
        id: "user-2",
        name: "Jane Doe",
      },
    },
    projects: {
      "project-1": {
        id: "project-1",
        name: "Website",
        ownerId: "user-1",
      },
      "project-2": {
        id: "project-2",
        name: "Dashboard",
        ownerId: "user-1",
      },
    },
    projectIds: ["project-1", "project-2"],
  };

  return (
    <section>
      <h2>1. Normalized Entity Collections</h2>
      <NormalizedStateStructure
        title="Entities stored by ID"
        description="Users and projects are stored separately and indexed by their identifiers. Projects reference users through ownerId instead of storing another complete User object."
      />

      <h2>2. Reading Relationships Through IDs</h2>
      <NormalizedStateExample initialState={initialState} />

      <h2>3. Updating One Canonical Entity</h2>
      <NormalizationBenefit
        title="One user, one canonical copy"
        description="Both projects reference user-1. Renaming that user updates the single user entity, so every component that reads user-1 can observe the same updated data."
      />

      <h2>4. When Normalization Is Not Necessary</h2>
      <NormalizationBenefit
        title="Simple state can remain simple"
        description="Normalization adds structural complexity. Small, local, or non-shared data does not necessarily benefit from separating entities and relationships."
      />
    </section>
  );
};

export default ClientStateNormalizationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// State normalization stores each shared entity as one canonical copy.
// Entity collections are commonly indexed by stable identifiers.
// Relationships can be represented with IDs instead of duplicated nested objects.
// Updating one canonical entity makes the change available to every reference to that entity.
// Normalized state can reduce duplicated data and inconsistent copies.
// Normalization is particularly useful when entities are shared across multiple parts of the UI.
// A normalized structure separates entity data from the relationships between entities.
// Read operations may require resolving identifiers into the corresponding entities.
// Normalization introduces additional structural complexity and is not necessary for every state shape.
// Simple or local data can often remain in a direct, denormalized representation.
