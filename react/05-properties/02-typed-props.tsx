/**
 * Typed Props
 * ===========
 *
 * Typed props establish formal contracts between React components and their consumers, enforcing
 * static type safety and structural compliance at compile time via TypeScript interfaces.
 *
 * Explicitly defining prop shapes prevents runtime type mismatches, documents component APIs
 * directly within the codebase, and enables intelligent autocomplete features in modern editors.
 * This strict typing discipline guarantees robust component composition across application trees.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Comprehensive Props Interface
// ---------------------------------------------------------------------

export interface UserCardProps {
  readonly userId: number;
  readonly fullName: string;
  readonly emailAddress: string;
  readonly isActive: boolean;
  readonly tags: ReadonlyArray<string>;
  readonly metadata: {
    readonly lastLogin: string;
    readonly permissionLevel: "admin" | "editor" | "viewer";
  };
}

// ---------------------------------------------------------------------
// 2. Component Implementing Strict Type Contracts
// ---------------------------------------------------------------------

export const UserCard: React.FC<UserCardProps> = (props) => {
  const { userId, fullName, emailAddress, isActive, tags, metadata } = props;

  return (
    <article className="user-card">
      <header>
        <h3>
          {fullName} (ID: {userId})
        </h3>
        <span className={isActive ? "status-active" : "status-inactive"}>{isActive ? "Active" : "Inactive"}</span>
      </header>

      <div className="card-body">
        <p>Email: {emailAddress}</p>
        <p>Permission: {metadata.permissionLevel.toUpperCase()}</p>
        <p>Last Login: {metadata.lastLogin}</p>
      </div>

      <footer className="card-footer">
        <h4>Tags:</h4>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </footer>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Container Supplying Typed Props
// ---------------------------------------------------------------------

export const UserCardContainer: React.FC = () => {
  const sampleUser: UserCardProps = {
    userId: 42,
    fullName: "Jane Doe",
    emailAddress: "jane.doe@example.com",
    isActive: true,
    tags: ["TypeScript", "React", "Architecture"],
    metadata: {
      lastLogin: "2026-09-16",
      permissionLevel: "admin",
    },
  };

  return (
    <section className="container">
      <h2>User Directory</h2>
      <UserCard {...sampleUser} />
    </section>
  );
};

export default UserCardContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Compile-Time Safety: TypeScript interfaces validate prop data structures before code execution occurs.
// - Explicit Contracts: Typed props document expected inputs clearly, serving as self-explanatory component specifications.
// - Readonly Enforcement: Immutable prop declarations (`readonly`) prevent accidental internal mutations.
// - Complex Shape Support: Interfaces accommodate nested objects, arrays, and union types seamlessly.
// - Enhanced Developer Ergonomics: Strict typing enables intelligent autocompletion and immediate error detection in editors.
