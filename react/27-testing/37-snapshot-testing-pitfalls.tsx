/**
 * Snapshot Testing Pitfalls
 * ==========================
 *
 * Snapshot tests can detect unexpected output changes, but poorly designed snapshots can become
 * noisy, fragile, difficult to review, or disconnected from meaningful behavior. The main goal is
 * to keep snapshots small, deterministic, intentional, and focused on stable output.
 */

import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Pitfall: snapshotting the entire DOM
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly name: string;
  readonly role: string;
}

export const UserCard: FC<UserCardProps> = ({ name, role }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{role}</p>
    </article>
  );
};

// A large DOM snapshot can capture many details that are not part of the
// behavior being tested:
//
// const {container} = render(
//     <UserCard
//         name="John Doe"
//         role="User"
//     />,
// );
//
// expect(container).toMatchSnapshot();
//
// If the important behavior is only the user's name and role, focused
// assertions can communicate that contract more precisely.

// ---------------------------------------------------------------------
// 2. Pitfall: snapshots that are too large
// ---------------------------------------------------------------------

// Large snapshots are difficult to review:
//
// expect(largeRenderedTree).toMatchSnapshot();
//
// A reviewer may have difficulty determining whether a changed class,
// wrapper, attribute, or nested element represents a meaningful regression.
//
// Prefer smaller snapshots or focused assertions when the complete output
// is not intentionally part of the test contract.

// ---------------------------------------------------------------------
// 3. Pitfall: testing implementation details
// ---------------------------------------------------------------------

interface InternalStateExampleProps {
  readonly active: boolean;
}

export const InternalStateExample: FC<InternalStateExampleProps> = ({ active }): ReactElement => {
  return (
    <section data-active={active}>
      <p>{active ? "Active" : "Inactive"}</p>
    </section>
  );
};

// A snapshot captures the `data-active` attribute:
//
// expect(container.firstChild).toMatchSnapshot();
//
// If `data-active` exists only to support internal implementation, the snapshot
// may unnecessarily couple the test to that attribute.
//
// A behavior-focused assertion is often clearer:
//
// expect(
//     screen.getByText("Active"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 4. Pitfall: updating snapshots blindly
// ---------------------------------------------------------------------

// A failing snapshot should not automatically be updated:
//
// vitest -u
//
// First inspect the difference:
//
// 1. What changed?
// 2. Why did it change?
// 3. Is the change intentional?
// 4. Does the changed output matter to the test?
//
// Only then should an intentional change be accepted into the snapshot.

// ---------------------------------------------------------------------
// 5. Pitfall: treating snapshots as truth
// ---------------------------------------------------------------------

// A snapshot only records what the current implementation produced.
//
// expect(renderedOutput).toMatchSnapshot();
//
// If the implementation is wrong when the snapshot is created, the snapshot
// simply preserves that incorrect output.
//
// Snapshot testing therefore does not eliminate the need to define meaningful
// expectations about application behavior.

// ---------------------------------------------------------------------
// 6. Pitfall: snapshots can hide intent
// ---------------------------------------------------------------------

// Compare:
//
// expect(container.firstChild).toMatchSnapshot();
//
// with:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// The second assertion communicates the expected behavior directly.
//
// A snapshot communicates that a complete representation should remain stable,
// but it may require opening the snapshot file to understand what matters.

// ---------------------------------------------------------------------
// 7. Pitfall: dynamic timestamps
// ---------------------------------------------------------------------

// Dynamic values make snapshots unstable:
//
// const result = {
//     name: "John Doe",
//     createdAt: new Date(),
// };
//
// expect(result).toMatchSnapshot();
//
// The timestamp changes between test runs.
//
// Use deterministic test data:
//
// const result = {
//     name: "John Doe",
//     createdAt: new Date(
//         "2026-01-01T00:00:00.000Z",
//     ),
// };
//
// expect(result).toMatchSnapshot();

// ---------------------------------------------------------------------
// 8. Pitfall: random values
// ---------------------------------------------------------------------

// Random values can produce a different snapshot on every run:
//
// const result = {
//     id: Math.random(),
// };
//
// expect(result).toMatchSnapshot();
//
// Prefer fixed test data:
//
// const result = {
//     id: "example-id",
// };
//
// expect(result).toMatchSnapshot();
//
// If the exact value is intentionally dynamic, use an appropriate matcher
// instead of freezing one arbitrary generated value.

// ---------------------------------------------------------------------
// 9. Pitfall: generated identifiers
// ---------------------------------------------------------------------

// Generated IDs can make snapshots fragile:
//
// const element = {
//     id: crypto.randomUUID(),
//     name: "John Doe",
// };
//
// expect(element).toMatchSnapshot();
//
// When the identifier itself is not the behavior under test, avoid making the
// exact generated value part of the snapshot.

// ---------------------------------------------------------------------
// 10. Property matchers for dynamic values
// ---------------------------------------------------------------------

// Property matchers can keep dynamic values out of the exact snapshot:
//
// const result = {
//     name: "John Doe",
//     createdAt: new Date(),
// };
//
// expect(result).toMatchSnapshot({
//     createdAt: expect.any(Date),
// });
//
// The snapshot can focus on stable properties while the matcher verifies that
// the dynamic property has the expected type.

// ---------------------------------------------------------------------
// 11. Pitfall: unstable ordering
// ---------------------------------------------------------------------

// Snapshots become noisy when output ordering is not deterministic:
//
// const users = getUsers();
//
// expect(users).toMatchSnapshot();
//
// If the order of `users` is not part of the contract, normalize it before
// snapshotting:
//
// const sortedUsers = [...users].sort(
//     (first, second) => first.name.localeCompare(second.name),
// );
//
// expect(sortedUsers).toMatchSnapshot();
//
// Only normalize output when ordering is genuinely irrelevant to the behavior
// being tested.

// ---------------------------------------------------------------------
// 12. Pitfall: snapshotting implementation-generated class names
// ---------------------------------------------------------------------

// Styling systems may generate class names:
//
// <div className="component_a1b2c3">
//     Content
// </div>
//
// If the generated value changes because of an unrelated implementation
// change, the snapshot can fail even though the user-visible behavior is
// unchanged.
//
// Prefer semantic assertions when generated styling identifiers are not part
// of the intended contract.

// ---------------------------------------------------------------------
// 13. Pitfall: snapshotting every component
// ---------------------------------------------------------------------

// Not every component needs a snapshot:
//
// expect(componentOutput).toMatchSnapshot();
//
// Adding snapshots automatically to every component can create a large suite
// of low-value snapshot files.
//
// Choose snapshots when the complete stable representation is useful.
// Otherwise, test the component's observable behavior directly.

// ---------------------------------------------------------------------
// 14. Pitfall: snapshotting every state
// ---------------------------------------------------------------------

// A component with many props and states can produce many snapshots:
//
// loading
// success
// empty
// error
// disabled
// authenticated
// unauthenticated
//
// Snapshotting every combination can create substantial maintenance overhead.
//
// Select the states where the complete representation is important and use
// focused assertions for simpler state-specific behavior.

// ---------------------------------------------------------------------
// 15. Pitfall: snapshotting incidental wrappers
// ---------------------------------------------------------------------

// A wrapper can become part of the snapshot:
//
// render(
//     <div className="test-wrapper">
//         <UserCard
//             name="John Doe"
//             role="User"
//         />
//     </div>,
// );
//
// expect(container).toMatchSnapshot();
//
// If the wrapper exists only for the test, it adds noise to the snapshot.
//
// Prefer snapshotting the smallest meaningful output when possible.

// ---------------------------------------------------------------------
// 16. Pitfall: snapshotting the wrong boundary
// ---------------------------------------------------------------------

// Consider a component tree:
//
// Page
//   -> UserPanel
//      -> UserCard
//
// Snapshotting the entire page:
//
// expect(pageOutput).toMatchSnapshot();
//
// may capture unrelated navigation, layout, and provider output.
//
// Snapshotting a small stable output:
//
// expect(userCardOutput).toMatchSnapshot();
//
// can provide a narrower regression boundary when the card's representation
// is what matters.

// ---------------------------------------------------------------------
// 17. Pitfall: snapshots of accessibility attributes without behavior tests
// ---------------------------------------------------------------------

export const AccessibleButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Save profile">
      Save
    </button>
  );
};

// A snapshot can preserve the `aria-label`:
//
// expect(container.firstChild).toMatchSnapshot();
//
// But a semantic query directly verifies the accessible interface:
//
// expect(
//     screen.getByRole("button", {name: "Save profile"}),
// ).toBeInTheDocument();
//
// A snapshot should complement rather than replace accessibility-focused tests.

// ---------------------------------------------------------------------
// 18. Pitfall: using snapshots instead of semantic queries
// ---------------------------------------------------------------------

// Avoid using a snapshot when the intended assertion is simple:
//
// expect(container.firstChild).toMatchSnapshot();
//
// If the requirement is "the button is available", use:
//
// expect(
//     screen.getByRole("button", {name: "Save"}),
// ).toBeInTheDocument();
//
// If the requirement is "the error is visible", use:
//
// expect(
//     screen.getByRole("alert"),
// ).toHaveTextContent("Could not save.");
//
// The assertion should match the behavior being verified.

// ---------------------------------------------------------------------
// 19. Pitfall: snapshots of unstable external data
// ---------------------------------------------------------------------

// External data can change independently of the application:
//
// const data = await fetchExternalData();
//
// expect(data).toMatchSnapshot();
//
// The test can become dependent on an external system's current output.
//
// Use controlled test data or a network-mocking boundary such as MSW:
//
// const data = {
//     id: "42",
//     name: "John Doe",
// };
//
// expect(data).toMatchSnapshot();

// ---------------------------------------------------------------------
// 20. Pitfall: environment-dependent snapshots
// ---------------------------------------------------------------------

// Output can differ between environments:
//
// const formatted = new Intl.DateTimeFormat().format(
//     new Date("2026-01-01T00:00:00.000Z"),
// );
//
// expect(formatted).toMatchSnapshot();
//
// Locale, timezone, platform, and runtime differences can make such snapshots
// unstable.
//
// Configure the environment explicitly or use deterministic formatting when
// the exact representation is part of the test.

// ---------------------------------------------------------------------
// 21. Pitfall: timezone-dependent snapshots
// ---------------------------------------------------------------------

// This can produce different output depending on the environment:
//
// const date = new Date(
//     "2026-01-01T00:00:00.000Z",
// );
//
// expect(date.toString()).toMatchSnapshot();
//
// Prefer a deterministic representation when appropriate:
//
// expect(date.toISOString()).toMatchSnapshot();
//
// ISO output represents the instant consistently in UTC.

// ---------------------------------------------------------------------
// 22. Pitfall: snapshots of localized text
// ---------------------------------------------------------------------

// Localized output can vary with locale configuration:
//
// const message = formatMessage("welcome");
//
// expect(message).toMatchSnapshot();
//
// If localization itself is not being tested, provide a deterministic locale
// or assert the behavior that matters without coupling the test to unrelated
// locale configuration.

// ---------------------------------------------------------------------
// 23. Pitfall: snapshotting huge collections
// ---------------------------------------------------------------------

// A large collection can create enormous snapshots:
//
// const users = createHundredsOfUsers();
//
// expect(users).toMatchSnapshot();
//
// Such a snapshot can be difficult to inspect and expensive to maintain.
//
// Test important collection behavior directly:
//
// expect(users).toHaveLength(100);
//
// expect(users[0]).toEqual(
//     expect.objectContaining({
//         name: "John Doe",
//     }),
// );

// ---------------------------------------------------------------------
// 24. Pitfall: snapshotting irrelevant attributes
// ---------------------------------------------------------------------

// A DOM snapshot may capture attributes that do not matter:
//
// <div
//     class="generated-class"
//     data-testid="user-card"
//     data-render-id="123"
// >
//     John Doe
// </div>
//
// If the test only needs to verify that the user's name is rendered:
//
// expect(
//     screen.getByText("John Doe"),
// ).toBeInTheDocument();
//
// This avoids making the test depend on generated attributes.

// ---------------------------------------------------------------------
// 25. Pitfall: snapshots of internal state
// ---------------------------------------------------------------------

// Internal component state should generally not be exposed merely to make
// snapshot testing easier:
//
// expect(componentState).toMatchSnapshot();
//
// State is an implementation mechanism.
//
// Prefer testing the output produced by that state:
//
// expect(
//     screen.getByText("Active"),
// ).toBeInTheDocument();
//
// This allows the implementation to change while preserving the same behavior.

// ---------------------------------------------------------------------
// 26. Pitfall: snapshots of private functions
// ---------------------------------------------------------------------

// Internal function output may not deserve snapshot coverage:
//
// const internalResult = privateHelper(input);
//
// expect(internalResult).toMatchSnapshot();
//
// If the helper's output has a stable, meaningful structure, a direct unit
// test can be appropriate. Otherwise, testing the public behavior that depends
// on it may provide a more useful contract.

// ---------------------------------------------------------------------
// 27. Pitfall: snapshots that change during refactoring
// ---------------------------------------------------------------------

// A harmless refactor can change DOM structure:
//
// // Before:
// <article>
//     <h2>John Doe</h2>
// </article>
//
// // After:
// <section>
//     <h2>John Doe</h2>
// </section>
//
// The snapshot fails even if the important behavior is unchanged.
//
// This is not automatically a bad failure: it tells you the captured
// representation changed. The problem occurs when the representation was never
// intended to be a stable contract.

// ---------------------------------------------------------------------
// 28. Pitfall: accepting all snapshot changes
// ---------------------------------------------------------------------

// Repeatedly doing this:
//
// vitest -u
//
// without reviewing the diff can turn snapshots into automatic approval
// mechanisms.
//
// A snapshot update should follow a deliberate review:
//
// current output
//     -> inspect diff
//     -> understand cause
//     -> confirm intended behavior
//     -> update snapshot

// ---------------------------------------------------------------------
// 29. Pitfall: one snapshot for unrelated behavior
// ---------------------------------------------------------------------

// Avoid combining unrelated behavior into one enormous snapshot:
//
// expect({
//     navigation,
//     user,
//     settings,
//     notifications,
//     footer,
// }).toMatchSnapshot();
//
// If each area has independent behavior, separate assertions or smaller
// snapshots can make failures easier to diagnose.

// ---------------------------------------------------------------------
// 30. Pitfall: snapshots with excessive test setup
// ---------------------------------------------------------------------

// Complicated setup can obscure why the snapshot exists:
//
// render(
//     <ProviderA>
//         <ProviderB>
//             <ProviderC>
//                 <UserCard
//                     name="John Doe"
//                     role="User"
//                 />
//             </ProviderC>
//         </ProviderB>
//     </ProviderA>,
// );
//
// If the providers are unrelated to the representation being tested, simplify
// the test boundary or provide a dedicated test wrapper.

// ---------------------------------------------------------------------
// 31. Pitfall: using snapshots to test interactions
// ---------------------------------------------------------------------

// A snapshot can show the result after an interaction:
//
// await user.click(
//     screen.getByRole("button", {name: "Open"}),
// );
//
// expect(container.firstChild).toMatchSnapshot();
//
// But the interaction's intended behavior may be clearer:
//
// expect(
//     screen.getByText("Additional content"),
// ).toBeInTheDocument();
//
// Use snapshots when the resulting structure itself matters, not merely because
// a snapshot can capture it.

// ---------------------------------------------------------------------
// 32. Pitfall: snapshots of every text change
// ---------------------------------------------------------------------

// If the requirement is one specific message:
//
// expect(
//     screen.getByRole("alert"),
// ).toHaveTextContent("Could not save.");
//
// is generally clearer than:
//
// expect(container.firstChild).toMatchSnapshot();
//
// A focused assertion makes the expected text explicit.

// ---------------------------------------------------------------------
// 33. Pitfall: snapshots that encode styling details
// ---------------------------------------------------------------------

// A snapshot may freeze class names:
//
// expect(container.firstChild).toMatchSnapshot();
//
// If styling changes frequently while behavior remains stable, the snapshot can
// become a maintenance burden.
//
// Styling-specific tests should be used only when a styling detail is genuinely
// part of the behavior or contract being protected.

// ---------------------------------------------------------------------
// 34. Pitfall: snapshots of third-party component internals
// ---------------------------------------------------------------------

// Third-party components can produce large internal DOM structures:
//
// render(
//     <ThirdPartyComponent
//         value="example"
//     />,
// );
//
// expect(container).toMatchSnapshot();
//
// An update to the third-party library may change the snapshot without changing
// the application's intended behavior.
//
// Prefer assertions against the application's own observable contract.

// ---------------------------------------------------------------------
// 35. Pitfall: snapshotting framework internals
// ---------------------------------------------------------------------

// Avoid treating framework-generated output as an application contract:
//
// expect(frameworkGeneratedTree).toMatchSnapshot();
//
// Framework internals can change between versions.
//
// Snapshot application-owned output when that output has a meaningful stable
// representation.

// ---------------------------------------------------------------------
// 36. Pitfall: snapshots that require constant regeneration
// ---------------------------------------------------------------------

// If a snapshot changes every time a harmless refactor occurs:
//
// expect(renderedTree).toMatchSnapshot();
//
// the test may be too tightly coupled to implementation structure.
//
// Consider replacing it with targeted assertions:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// A test should remain useful after reasonable internal refactoring.

// ---------------------------------------------------------------------
// 37. Pitfall: snapshotting values that are easier to assert directly
// ---------------------------------------------------------------------

// Avoid:
//
// expect(result).toMatchSnapshot();
//
// when the expected value is simple and stable:
//
// expect(result).toEqual({
//     name: "John Doe",
//     role: "User",
// });
//
// Direct assertions make the expected structure visible in the test itself
// and avoid a separate snapshot artifact.

// ---------------------------------------------------------------------
// 38. Pitfall: confusing snapshot coverage with behavioral coverage
// ---------------------------------------------------------------------

// A snapshot can cover many lines of rendered output without verifying that
// the important interactions work.
//
// For example:
//
// expect(container).toMatchSnapshot();
//
// does not by itself prove that:
//
// - A button can be clicked.
// - A form submits.
// - Validation appears.
// - A loading state resolves.
// - An error can be recovered from.
//
// Behavioral tests should cover meaningful interactions separately.

// ---------------------------------------------------------------------
// 39. Pitfall: snapshot tests without explicit state setup
// ---------------------------------------------------------------------

// Avoid relying on implicit defaults when the state matters:
//
// render(<UserCard />);
//
// expect(container.firstChild).toMatchSnapshot();
//
// Prefer explicit inputs:
//
// render(
//     <UserCard
//         name="John Doe"
//         role="User"
//     />,
// );
//
// expect(container.firstChild).toMatchSnapshot();
//
// Explicit setup makes the snapshot easier to understand and reproduce.

// ---------------------------------------------------------------------
// 40. Pitfall: snapshot tests without deterministic data
// ---------------------------------------------------------------------

// A stable snapshot needs stable inputs:
//
// const user = {
//     id: "42",
//     name: "John Doe",
//     role: "User",
// };
//
// render(<UserCard {...user} />);
//
// expect(container.firstChild).toMatchSnapshot();
//
// Avoid hidden dependencies on current time, randomness, external APIs,
// environment configuration, or machine-specific values.

// ---------------------------------------------------------------------
// 41. Better: small data snapshots
// ---------------------------------------------------------------------

interface UserSummary {
  readonly id: string;
  readonly name: string;
  readonly roles: readonly string[];
}

export const createUserSummary = (): UserSummary => {
  return {
    id: "42",
    name: "John Doe",
    roles: ["user"],
  };
};

// A small deterministic object is often a better snapshot candidate:
//
// expect(createUserSummary()).toMatchSnapshot();
//
// The entire structure is compact enough to review and represents a
// well-defined output.

// ---------------------------------------------------------------------
// 42. Better: focused DOM assertions
// ---------------------------------------------------------------------

// For user-facing behavior:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// expect(
//     screen.getByText("User"),
// ).toBeInTheDocument();
//
// These assertions remain focused on what the user can observe.

// ---------------------------------------------------------------------
// 43. Better: snapshot only the meaningful output
// ---------------------------------------------------------------------

// Instead of snapshotting an entire page:
//
// expect(container).toMatchSnapshot();
//
// select a stable output when appropriate:
//
// const card = screen.getByRole("article");
//
// expect(card).toMatchSnapshot();
//
// The smaller boundary reduces unrelated snapshot changes.

// ---------------------------------------------------------------------
// 44. Better: use property matchers for intentional variability
// ---------------------------------------------------------------------

// Dynamic values should not be frozen accidentally:
//
// expect({
//     id: "42",
//     createdAt: new Date(),
// }).toMatchSnapshot({
//     createdAt: expect.any(Date),
// });
//
// This preserves useful structure while acknowledging intentional variability.

// ---------------------------------------------------------------------
// 45. Better: review snapshot diffs
// ---------------------------------------------------------------------

// A snapshot diff should answer:
//
// What changed?
//
// Why did it change?
//
// Is the change intentional?
//
// Does the test still protect a meaningful contract?
//
// If the answer is unclear, the snapshot may be too broad or the test may need
// a more explicit assertion.

// ---------------------------------------------------------------------
// 46. Better: combine snapshots with behavioral assertions
// ---------------------------------------------------------------------

// Snapshot testing does not need to be the only assertion:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// expect(container.firstChild).toMatchSnapshot();
//
// The semantic assertion communicates the user-facing requirement.
// The snapshot can additionally protect the complete stable representation
// when that representation is valuable.

// ---------------------------------------------------------------------
// 47. Better: choose the smallest useful test contract
// ---------------------------------------------------------------------

// A useful hierarchy is:
//
// Specific behavior
//     -> focused assertion
//
// Stable structured output
//     -> small snapshot
//
// Complete stable representation
//     -> larger snapshot, when justified
//
// The goal is not to avoid snapshots entirely.
// The goal is to use them only where their comparison model adds value.

// ---------------------------------------------------------------------
// 48. Practical snapshot checklist
// ---------------------------------------------------------------------

// Before adding a snapshot, ask:
//
// - Is the output deterministic?
// - Is the output small enough to review?
// - Is the complete representation actually important?
// - Does the snapshot avoid irrelevant implementation details?
// - Would a focused assertion communicate the requirement more clearly?
// - Will reasonable refactoring unnecessarily invalidate the snapshot?
// - Can a reviewer understand a snapshot diff quickly?
//
// If most answers are unfavorable, a focused assertion is usually a better fit.

// ---------------------------------------------------------------------
// 49. Snapshot maintenance checklist
// ---------------------------------------------------------------------

// When a snapshot fails:
//
// 1. Inspect the diff.
// 2. Identify the changed output.
// 3. Determine the cause.
// 4. Decide whether the change is intentional.
// 5. Fix unexpected behavior.
// 6. Update the snapshot only for an intentional change.
// 7. Review the updated snapshot.
//
// Never treat snapshot regeneration as the same thing as fixing a failing test.

// ---------------------------------------------------------------------
// 50. Core principle
// ---------------------------------------------------------------------

// The purpose of a snapshot is to protect a meaningful representation:
//
// expect(stableOutput).toMatchSnapshot();
//
// It should not become a mechanism for freezing every implementation detail.
//
// Small, deterministic, intentional snapshots are easier to understand,
// review, and maintain than large snapshots containing unrelated output.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Large snapshots can become difficult to review and maintain.
// - Snapshot failures should be investigated before snapshots are updated.
// - A snapshot records output; it does not prove that the output is correct.
// - Dynamic timestamps, random values, generated IDs, and environment-dependent values can make snapshots unstable.
// - Property matchers can isolate intentionally dynamic values.
// - Unstable ordering should be normalized only when ordering is not part of the behavior.
// - Generated class names and framework internals can create unnecessary snapshot coupling.
// - Not every component, state, interaction, or value needs snapshot coverage.
// - Focused semantic assertions are often clearer for user-facing behavior.
// - Small deterministic data structures are often better snapshot candidates than large rendered trees.
// - Snapshotting third-party or framework-generated internals can create unrelated failures.
// - Snapshot coverage does not replace behavioral coverage for interactions, validation, loading, or error handling.
// - Explicit state and deterministic test data make snapshots easier to understand and reproduce.
// - Combining focused assertions with carefully chosen snapshots can protect both behavior and meaningful structure.
// - The smallest useful test contract is generally easier to maintain than a snapshot of the entire implementation.
