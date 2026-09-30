/**
 * Early Return Rendering
 * ======================
 *
 * Early return rendering is an architectural pattern where a component checks for prerequisite conditions
 * (such as loading states, null data, authentication errors, or missing configurations) at the top of its
 * function body and returns an alternate JSX tree immediately.
 *
 * Top-level guard clauses handle status-driven UI branches (like loading spinners or error screens) early,
 * short-circuiting execution before reaching the primary return block. This fail-fast execution eliminates
 * deeply nested inline ternaries, ensuring the main render block assumes valid data structures safely.
 */

import React, { useState } from "react";

export interface UserProfileCardProps {
  readonly username: string;
  readonly role: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = (props) => {
  const { username, role } = props;

  return (
    <div>
      <h3>User Profile</h3>
      <p>Username: {username}</p>
      <p>Role: {role}</p>
    </div>
  );
};

export const EarlyReturnContainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(true);

  const handleToggleLoading = (): void => {
    setIsLoading((prev) => !prev);
  };

  const handleToggleError = (): void => {
    setHasError((prev) => !prev);
  };

  const handleToggleData = (): void => {
    setIsDataLoaded((prev) => !prev);
  };

  // 1. Early Return for Asynchronous Loading States
  if (isLoading) {
    return (
      <div>
        <h2>Loading Application Data...</h2>
        <button type="button" onClick={handleToggleLoading}>
          Finish Loading
        </button>
      </div>
    );
  }

  // 2. Early Return for Error States
  if (hasError) {
    return (
      <div>
        <h2>Error: Failed to retrieve server records.</h2>
        <button type="button" onClick={handleToggleError}>
          Retry Connection
        </button>
      </div>
    );
  }

  // 3. Early Return for Missing or Null Data States
  if (!isDataLoaded) {
    return (
      <div>
        <h2>No user profile records found.</h2>
        <button type="button" onClick={handleToggleData}>
          Load Data
        </button>
      </div>
    );
  }

  // 4. Primary Render Block (Assumes all prerequisite guards have passed)
  return (
    <div>
      <h1>Early Return Rendering Architecture Demonstration</h1>
      <p>Demonstrating guard clauses and fail-fast execution patterns before primary component rendering.</p>

      <div>
        <button type="button" onClick={handleToggleLoading}>
          Simulate Loading
        </button>
        <button type="button" onClick={handleToggleError}>
          Simulate Error
        </button>
        <button type="button" onClick={handleToggleData}>
          Simulate Empty Data
        </button>
      </div>

      <UserProfileCard username="SeniorArchitect" role="Platform Lead" />
    </div>
  );
};

export default EarlyReturnContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Guard Clause Execution: Cleans up component bodies by evaluating prerequisite conditions before main render blocks execute.
// - Fail-Fast Principle: Short-circuits rendering immediately when encountering loading, error, or missing data states.
// - Clean Primary Blocks: Keeps main return statements focused purely on presenting validated runtime data.
// - Status UI Isolation: Decouples feedback presentation (spinners, error messages) from core domain presentation.
// - Clean Architecture Compliance: Inputs are explicitly destructured on separate lines inside component bodies, maintaining standard layout conventions.
