/**
 * Testing Suspense
 * ================
 *
 * React Suspense lets a component display fallback UI while something in its subtree
 * is not yet ready to render. Tests should verify the observable loading, success,
 * and error states while coordinating asynchronous work deterministically.
 */

import { Suspense, use, useState, type FC, type ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Basic Suspense boundary
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserDetailsProps {
  readonly userPromise: Promise<User>;
}

export const UserDetails: FC<UserDetailsProps> = ({ userPromise }): ReactElement => {
  const user = use(userPromise);

  return <p>User: {user.name}</p>;
};

export const UserDetailsExample: FC<UserDetailsProps> = ({ userPromise }): ReactElement => {
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
};

// Suspense displays its fallback while a child suspends:
//
// const userPromise = Promise.resolve({name: "John Doe"});
//
// render(<UserDetailsExample userPromise={userPromise} />);
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 2. Testing the fallback state
// ---------------------------------------------------------------------

// The fallback is normal rendered UI and should be queried through accessible
// or user-facing selectors:
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// Prefer testing the fallback's semantics over checking React's internal
// Suspense state.

// ---------------------------------------------------------------------
// 3. Testing the resolved state
// ---------------------------------------------------------------------

// A Promise that has not resolved yet provides a deterministic way to observe
// the fallback before resolving it:
//
// let resolveUser!: (user: User) => void;
//
// const userPromise = new Promise<User>((resolve) => {
//     resolveUser = resolve;
// });
//
// render(<UserDetailsExample userPromise={userPromise} />);
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// resolveUser({name: "John Doe"});
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();
//
// The test controls the Promise instead of relying on an arbitrary timeout.

// ---------------------------------------------------------------------
// 4. Deferred promises
// ---------------------------------------------------------------------

interface Deferred<T> {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (reason?: unknown) => void;
}

export const createDeferred = <T,>(): Deferred<T> => {
  let resolvePromise!: (value: T) => void;
  let rejectPromise!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
};

// A deferred Promise makes the loading transition explicit:
//
// const deferred = createDeferred<User>();
//
// render(<UserDetailsExample userPromise={deferred.promise} />);
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// deferred.resolve({name: "John Doe"});
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 5. `findBy` for the resolved UI
// ---------------------------------------------------------------------

// `findBy` queries are useful when the expected element appears asynchronously:
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();
//
// A `findBy` query combines a query with waiting for the element to appear.
// It should be used for an expected asynchronous transition rather than adding
// an arbitrary delay.

// ---------------------------------------------------------------------
// 6. Waiting for disappearance of the fallback
// ---------------------------------------------------------------------

// The fallback can also be tested explicitly:
//
// const deferred = createDeferred<User>();
//
// render(<UserDetailsExample userPromise={deferred.promise} />);
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// deferred.resolve({name: "John Doe"});
//
// await waitForElementToBeRemoved(
//     screen.getByText("Loading user..."),
// );
//
// expect(screen.getByText("User: John Doe")).toBeInTheDocument();
//
// This verifies both sides of the transition.

// ---------------------------------------------------------------------
// 7. Testing Suspense with user interaction
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
}

interface ProfileLoaderProps {
  readonly loadProfile: () => Promise<Profile>;
}

export const ProfileLoader: FC<ProfileLoaderProps> = ({ loadProfile }): ReactElement => {
  const [profilePromise, setProfilePromise] = useState<Promise<Profile> | null>(null);

  if (profilePromise !== null) {
    return (
      <Suspense fallback={<p>Loading profile...</p>}>
        <ProfileContent profilePromise={profilePromise} />
      </Suspense>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setProfilePromise(loadProfile());
      }}
    >
      Load profile
    </button>
  );
};

interface ProfileContentProps {
  readonly profilePromise: Promise<Profile>;
}

export const ProfileContent: FC<ProfileContentProps> = ({ profilePromise }): ReactElement => {
  const profile = use(profilePromise);

  return <p>Profile: {profile.name}</p>;
};

// The interaction can be tested without sleeping:
//
// const user = userEvent.setup();
// const deferred = createDeferred<Profile>();
//
// render(
//     <ProfileLoader
//         loadProfile={() => deferred.promise}
//     />,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Load profile"}),
// );
//
// expect(screen.getByText("Loading profile...")).toBeInTheDocument();
//
// deferred.resolve({name: "John Doe"});
//
// expect(
//     await screen.findByText("Profile: John Doe"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 8. Suspense boundaries and fallback scope
// ---------------------------------------------------------------------

export const Dashboard: FC = (): ReactElement => {
  return (
    <main>
      <h1>Dashboard</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <ProfileContent profilePromise={Promise.resolve({ name: "John Doe" })} />
      </Suspense>

      <p>Static dashboard content.</p>
    </main>
  );
};

// Suspense only replaces the content inside its boundary while that subtree
// is suspended. Content outside the boundary can remain rendered.
//
// expect(screen.getByRole("heading", {name: "Dashboard"})).toBeInTheDocument();
// expect(screen.getByText("Static dashboard content.")).toBeInTheDocument();
//
// The exact visible fallback depends on which descendant suspends and where
// the Suspense boundary is placed.

// ---------------------------------------------------------------------
// 9. Nested Suspense boundaries
// ---------------------------------------------------------------------

export const NestedSuspense: FC<{
  readonly profilePromise: Promise<Profile>;
  readonly userPromise: Promise<User>;
}> = ({ profilePromise, userPromise }): ReactElement => {
  return (
    <Suspense fallback={<p>Loading application...</p>}>
      <h1>Account</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <ProfileContent profilePromise={profilePromise} />
      </Suspense>

      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
};

// Nested boundaries allow different parts of a UI to have different fallback
// behavior. Tests should reflect the application's intended boundary structure
// rather than assuming that every suspension produces one global fallback.

// ---------------------------------------------------------------------
// 10. Suspense with an already resolved Promise
// ---------------------------------------------------------------------

// A resolved Promise does not necessarily mean a test should assert the loading
// state. If the resource is already ready when rendering begins, the component
// may render its content without an observable fallback transition:
//
// render(
//     <UserDetailsExample
//         userPromise={Promise.resolve({name: "John Doe"})}
//     />,
// );
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();

// When testing a loading state specifically, use a deferred Promise rather than
// relying on a Promise that may resolve before the assertion.

// ---------------------------------------------------------------------
// 11. Testing asynchronous transitions
// ---------------------------------------------------------------------

// The preferred sequence is:
//
// const deferred = createDeferred<User>();
//
// render(<UserDetailsExample userPromise={deferred.promise} />);
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// deferred.resolve({name: "John Doe"});
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();
//
// This gives the test explicit control over the asynchronous boundary.

// ---------------------------------------------------------------------
// 12. Suspense and errors
// ---------------------------------------------------------------------

// Suspense handles waiting, not rejected Promises by itself.
// A rejected asynchronous operation needs an error-handling mechanism such as
// an Error Boundary:
//
// <ErrorBoundary>
//     <Suspense fallback={<p>Loading user...</p>}>
//         <UserDetails userPromise={userPromise} />
//     </Suspense>
// </ErrorBoundary>
//
// Tests for a rejected Promise should therefore verify the application's
// actual error boundary behavior rather than expecting Suspense to render
// an error fallback automatically.

// ---------------------------------------------------------------------
// 13. Testing a rejected Promise
// ---------------------------------------------------------------------

// A controlled rejection can be created with the deferred helper:
//
// const deferred = createDeferred<User>();
//
// render(
//     <ErrorBoundary>
//         <Suspense fallback={<p>Loading user...</p>}>
//             <UserDetails userPromise={deferred.promise} />
//         </Suspense>
//     </ErrorBoundary>,
// );
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// deferred.reject(new Error("Request failed"));
//
// expect(
//     await screen.findByRole("alert"),
// ).toBeInTheDocument();
//
// The exact fallback depends on the Error Boundary implementation.

// ---------------------------------------------------------------------
// 14. Avoid arbitrary delays
// ---------------------------------------------------------------------

// Avoid:
//
// await new Promise((resolve) => setTimeout(resolve, 100));
//
// A fixed delay does not prove that the Suspense transition has completed.
// It also makes tests slower and potentially flaky.
//
// Prefer:
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();
//
// Wait for the observable result instead of waiting for elapsed time.

// ---------------------------------------------------------------------
// 15. Suspense fallback accessibility
// ---------------------------------------------------------------------

export const AccessibleSuspense: FC<{
  readonly promise: Promise<User>;
}> = ({ promise }): ReactElement => {
  return (
    <Suspense fallback={<output aria-label="Loading user">Loading user...</output>}>
      <UserDetails userPromise={promise} />
    </Suspense>
  );
};

// The fallback should expose meaningful semantics when appropriate:
//
// const deferred = createDeferred<User>();
//
// render(<AccessibleSuspense promise={deferred.promise} />);
//
// expect(
//     screen.getByRole("status", {name: "Loading user"}),
// ).toBeInTheDocument();
//
// If a native element does not provide the intended role, add the appropriate
// semantic role explicitly rather than making the test depend on an incorrect
// accessibility assumption.

// ---------------------------------------------------------------------
// 16. Testing multiple asynchronous resources
// ---------------------------------------------------------------------

// Multiple resources can be controlled independently:
//
// const userDeferred = createDeferred<User>();
// const profileDeferred = createDeferred<Profile>();
//
// render(
//     <NestedSuspense
//         userPromise={userDeferred.promise}
//         profilePromise={profileDeferred.promise}
//     />,
// );
//
// expect(screen.getByText("Loading profile...")).toBeInTheDocument();
//
// profileDeferred.resolve({name: "John Doe"});
//
// expect(
//     await screen.findByText("Profile: John Doe"),
// ).toBeInTheDocument();
//
// userDeferred.resolve({name: "John Doe"});
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();
//
// Controlled resources make each transition deterministic.

// ---------------------------------------------------------------------
// 17. Suspense does not mean "show a spinner"
// ---------------------------------------------------------------------

// Suspense is a rendering mechanism, not a requirement to display a spinner.
// The fallback can be any React node:
//
// <Suspense fallback={<p>Loading...</p>}>
//     ...
// </Suspense>
//
// Tests should assert the actual fallback exposed by the application rather
// than assuming that Suspense always renders a loading indicator.

// ---------------------------------------------------------------------
// 18. Testing the loading-to-content transition
// ---------------------------------------------------------------------

export const LoadingTransitionExample: FC<{
  readonly promise: Promise<User>;
}> = ({ promise }): ReactElement => {
  return (
    <section aria-label="User information">
      <h2>User information</h2>

      <Suspense fallback={<p>Loading user...</p>}>
        <UserDetails userPromise={promise} />
      </Suspense>
    </section>
  );
};

// A complete transition test can verify the sequence:
//
// const deferred = createDeferred<User>();
//
// render(<LoadingTransitionExample promise={deferred.promise} />);
//
// expect(
//     screen.getByRole("heading", {name: "User information"}),
// ).toBeInTheDocument();
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// deferred.resolve({name: "John Doe"});
//
// expect(
//     await screen.findByText("User: John Doe"),
// ).toBeInTheDocument();
//
// expect(
//     screen.queryByText("Loading user..."),
// ).not.toBeInTheDocument();

// ---------------------------------------------------------------------
// 19. Avoid testing Suspense implementation details
// ---------------------------------------------------------------------

// Prefer:
//
// expect(screen.getByText("Loading user...")).toBeInTheDocument();
//
// over assertions about internal Promise state, Suspense fibers, or React
// implementation details.
//
// The test should describe what the rendered application does when its data
// is unavailable and when that data becomes available.

// ---------------------------------------------------------------------
// 20. Complete testing pattern
// ---------------------------------------------------------------------

// A reliable Suspense test generally follows this sequence:
//
// 1. Create a controlled asynchronous resource.
// 2. Render the component inside the appropriate Suspense boundary.
// 3. Assert the initial fallback when the resource is pending.
// 4. Resolve or reject the resource explicitly.
// 5. Await the observable UI transition.
// 6. Assert the resulting content or error state.
//
// This keeps asynchronous tests deterministic and avoids arbitrary timing.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Suspense displays fallback UI while a descendant is suspended.
// - Test Suspense through the rendered loading, success, and error states.
// - Use controlled or deferred Promises when the loading state must be deterministic.
// - Use `findBy` queries for content that appears asynchronously.
// - Use `waitForElementToBeRemoved` when disappearance of fallback UI matters.
// - Do not use arbitrary timeouts to wait for Suspense transitions.
// - Suspense handles waiting; rejected asynchronous work requires appropriate error handling.
// - Nested Suspense boundaries can provide different fallback scopes.
// - A resolved resource may not produce an observable loading state.
// - Test fallback accessibility when the fallback represents meaningful user-facing status.
// - Avoid assertions about React's internal Suspense implementation.
