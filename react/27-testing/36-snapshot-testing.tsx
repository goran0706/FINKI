/**
 * Snapshot Testing
 * =================
 *
 * Snapshot testing captures a representation of rendered output and compares future test runs
 * against that stored result. It can detect unexpected structural changes, but snapshots should
 * remain focused and readable so that failures are meaningful rather than becoming large approval files.
 */

import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic snapshot testing
// ---------------------------------------------------------------------

// A snapshot test renders a value and asks Vitest to compare it with a
// previously stored snapshot:
//
// it("matches the snapshot", () => {
//     const value = {
//         name: "John Doe",
//         role: "user",
//     };
//
//     expect(value).toMatchSnapshot();
// });
//
// On the first run, Vitest creates the snapshot.
// On subsequent runs, Vitest compares the current value with the stored snapshot.
//
// Snapshot files are normally generated alongside the test file in a
// `__snapshots__` directory.

// ---------------------------------------------------------------------
// 2. Snapshotting a React component
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

// React Testing Library can render the component:
//
// import {render} from "@testing-library/react";
//
// it("matches the snapshot", () => {
//     const {container} = render(
//         <UserCard
//             name="John Doe"
//             role="User"
//         />,
//     );
//
//     expect(container.firstChild).toMatchSnapshot();
// });
//
// The snapshot contains the rendered DOM structure rather than the component's
// source code.

// ---------------------------------------------------------------------
// 3. What a snapshot represents
// ---------------------------------------------------------------------

// A snapshot captures the value supplied to the matcher.
//
// expect({
//     name: "John Doe",
//     active: true,
// }).toMatchSnapshot();
//
// A generated snapshot is conceptually similar to:
//
// exports[`matches the snapshot 1`] = `
// {
//   "active": true,
//   "name": "John Doe",
// }
// `;
//
// The exact formatting is managed by the test runner.

// ---------------------------------------------------------------------
// 4. Inline snapshots
// ---------------------------------------------------------------------

// `toMatchInlineSnapshot` stores the snapshot directly inside the test:
//
// it("matches an inline snapshot", () => {
//     const value = {
//         name: "John Doe",
//         active: true,
//     };
//
//     expect(value).toMatchInlineSnapshot(`
//       {
//         "active": true,
//         "name": "John Doe",
//       }
//     `);
// });
//
// Inline snapshots keep the expected representation close to the test,
// which can be useful for small values.

// ---------------------------------------------------------------------
// 5. Updating snapshots
// ---------------------------------------------------------------------

// When an intentional change modifies the expected output, update the snapshot
// rather than manually editing it:
//
// vitest -u
//
// or:
//
// vitest --update
//
// The exact command can also be configured through the project's package scripts.
//
// Updating a snapshot means accepting the new output as the expected result.
// A snapshot should not be updated automatically simply to make a failing test pass.

// ---------------------------------------------------------------------
// 6. Snapshot failures
// ---------------------------------------------------------------------

// A snapshot failure means that the current value differs from the stored value:
//
// expect(currentValue).toMatchSnapshot();
//
// If the change is intentional:
//
// 1. Inspect the difference.
// 2. Confirm that the new behavior is correct.
// 3. Update the snapshot.
//
// If the change is unexpected, fix the implementation instead.
//
// The snapshot is evidence of a change, not proof that the new output is correct.

// ---------------------------------------------------------------------
// 7. Snapshotting accessible DOM
// ---------------------------------------------------------------------

// A DOM snapshot can contain a large amount of implementation detail:
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
// This can be useful when the exact DOM structure is an important artifact,
// but it can also create noisy snapshots when many unrelated attributes or
// wrappers change.

// ---------------------------------------------------------------------
// 8. Focused assertions versus snapshots
// ---------------------------------------------------------------------

// A focused assertion is often clearer:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// expect(
//     screen.getByText("User"),
// ).toBeInTheDocument();
//
// A snapshot instead verifies the entire captured representation:
//
// expect(container.firstChild).toMatchSnapshot();
//
// Focused assertions usually communicate the intended behavior more directly.
// Snapshots are useful when the complete representation itself is meaningful.

// ---------------------------------------------------------------------
// 9. Snapshotting serializable data
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

// Data snapshots can be appropriate when the complete object structure is
// part of what should remain stable:
//
// it("matches the user summary", () => {
//     expect(createUserSummary()).toMatchSnapshot();
// });
//
// This is often easier to review than a large rendered DOM snapshot.

// ---------------------------------------------------------------------
// 10. Snapshotting arrays
// ---------------------------------------------------------------------

// Arrays can also be snapshot tested:
//
// it("matches the user list", () => {
//     const users = [
//         {
//             id: "1",
//             name: "John Doe",
//         },
//         {
//             id: "2",
//             name: "Jane Doe",
//         },
//     ];
//
//     expect(users).toMatchSnapshot();
// });
//
// The snapshot records the complete array and each object's structure.

// ---------------------------------------------------------------------
// 11. Property matchers
// ---------------------------------------------------------------------

// Dynamic properties can make snapshots unstable:
//
// const user = {
//     id: "42",
//     name: "John Doe",
//     createdAt: new Date(),
// };
//
// A property matcher can describe the expected type:
//
// expect(user).toMatchSnapshot({
//     createdAt: expect.any(Date),
// });
//
// This keeps the snapshot focused on stable properties while allowing
// intentionally dynamic values to vary.

// ---------------------------------------------------------------------
// 12. Asymmetric matchers
// ---------------------------------------------------------------------

// Snapshot assertions can use asymmetric matchers for dynamic fields:
//
// expect({
//     id: "42",
//     name: "John Doe",
//     timestamp: Date.now(),
// }).toMatchSnapshot({
//     timestamp: expect.any(Number),
// });
//
// The matcher verifies the dynamic property's general shape instead of
// requiring one exact timestamp.

// ---------------------------------------------------------------------
// 13. Snapshotting with user interaction
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly initiallyOpen?: boolean;
}

export const Toggle: FC<ToggleProps> = ({ initiallyOpen = false }): ReactElement => {
  return (
    <section>
      <button type="button">{initiallyOpen ? "Close" : "Open"}</button>

      {initiallyOpen && <p>Additional content</p>}
    </section>
  );
};

// A snapshot can represent the UI after an interaction:
//
// const {container} = render(
//     <Toggle initiallyOpen={false} />,
// );
//
// expect(container.firstChild).toMatchSnapshot();
//
// // Perform an interaction.
//
// expect(container.firstChild).toMatchSnapshot();
//
// This can verify structural changes, but focused assertions are often better
// when the important behavior is simply whether content appears or disappears.

// ---------------------------------------------------------------------
// 14. Snapshotting multiple states
// ---------------------------------------------------------------------

// Different component states should have separate expectations:
//
// it("matches the closed state", () => {
//     const {container} = render(
//         <Toggle initiallyOpen={false} />,
//     );
//
//     expect(container.firstChild).toMatchSnapshot();
// });
//
// it("matches the open state", () => {
//     const {container} = render(
//         <Toggle initiallyOpen={true} />,
//     );
//
//     expect(container.firstChild).toMatchSnapshot();
// });
//
// Explicit state-specific tests make failures easier to understand than
// one snapshot containing many unrelated states.

// ---------------------------------------------------------------------
// 15. Snapshot names
// ---------------------------------------------------------------------

// Snapshot names can make generated output easier to identify:
//
// expect(value).toMatchSnapshot("user summary");
//
// This gives the snapshot a descriptive name in the generated snapshot file.
//
// Prefer names that describe the state or behavior rather than implementation
// details.

// ---------------------------------------------------------------------
// 16. One snapshot can hide many changes
// ---------------------------------------------------------------------

// Consider a component with a large DOM tree:
//
// expect(container).toMatchSnapshot();
//
// A single snapshot failure may contain changes to:
//
// - Text.
// - Attributes.
// - Element structure.
// - Classes.
// - Nested components.
// - Accessibility attributes.
//
// This can make it difficult to identify which behavior actually matters.
//
// Focused assertions can isolate important expectations:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// expect(
//     screen.getByText("User"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 17. Large snapshots
// ---------------------------------------------------------------------

// Large snapshots are difficult to review:
//
// expect(largeRenderedTree).toMatchSnapshot();
//
// If a snapshot grows substantially, consider whether every captured detail
// is intentionally part of the test contract.
//
// Smaller snapshots are generally easier to review and maintain.

// ---------------------------------------------------------------------
// 18. Snapshotting implementation details
// ---------------------------------------------------------------------

// Avoid snapshots whose main purpose is to freeze internal implementation:
//
// expect({
//     internalState: true,
//     privateCache: [],
// }).toMatchSnapshot();
//
// Internal implementation details can change without changing user-visible
// behavior.
//
// A useful snapshot should represent an output or data structure whose shape
// matters to the test.

// ---------------------------------------------------------------------
// 19. Snapshot testing and accessibility
// ---------------------------------------------------------------------

// A snapshot can preserve accessibility attributes:
//
// <button
//     type="button"
//     aria-label="Save profile"
// >
//     Save
// </button>
//
// But a snapshot does not replace accessibility-oriented assertions:
//
// expect(
//     screen.getByRole("button", {name: "Save profile"}),
// ).toBeInTheDocument();
//
// Role and accessible-name queries test the interface from the user's perspective,
// while a snapshot records the rendered representation.

// ---------------------------------------------------------------------
// 20. Snapshot testing and semantic queries
// ---------------------------------------------------------------------

// A semantic query:
//
// screen.getByRole("button", {name: "Save"});
//
// communicates what the test expects the user to find.
//
// A snapshot:
//
// expect(container.firstChild).toMatchSnapshot();
//
// communicates that the captured representation should remain stable.
//
// Use each approach for the behavior it expresses most clearly.

// ---------------------------------------------------------------------
// 21. Snapshot testing asynchronous output
// ---------------------------------------------------------------------

// Asynchronous UI should be allowed to reach the intended state before
// snapshotting:
//
// render(<AsyncComponent />);
//
// expect(
//     await screen.findByText("Loaded"),
// ).toBeInTheDocument();
//
// expect(
//     screen.getByTestId("content"),
// ).toMatchSnapshot();
//
// Snapshotting immediately after rendering may capture only the loading state.
//
// When possible, a focused assertion can be clearer than snapshotting the
// complete asynchronous DOM.

// ---------------------------------------------------------------------
// 22. Snapshot testing error states
// ---------------------------------------------------------------------

// Error states can also be snapshot tested:
//
// render(<ErrorState />);
//
// expect(
//     screen.getByRole("alert"),
// ).toMatchSnapshot();
//
// However, if the important contract is the visible message:
//
// expect(
//     screen.getByRole("alert"),
// ).toHaveTextContent("Could not load user.");
//
// The focused assertion avoids coupling the test to unrelated markup.

// ---------------------------------------------------------------------
// 23. Snapshot testing props
// ---------------------------------------------------------------------

// A component can have multiple meaningful prop combinations:
//
// it("matches the default state", () => {
//     const {container} = render(
//         <UserCard
//             name="John Doe"
//             role="User"
//         />,
//     );
//
//     expect(container.firstChild).toMatchSnapshot();
// });
//
// it("matches an administrator state", () => {
//     const {container} = render(
//         <UserCard
//             name="John Doe"
//             role="Administrator"
//         />,
//     );
//
//     expect(container.firstChild).toMatchSnapshot();
// });
//
// Each snapshot should correspond to a meaningful state rather than every
// possible combination of props.

// ---------------------------------------------------------------------
// 24. Snapshot tests should remain deterministic
// ---------------------------------------------------------------------

// Avoid uncontrolled values in snapshots:
//
// const value = {
//     timestamp: Date.now(),
//     randomId: Math.random(),
// };
//
// Such values change between runs.
//
// Prefer deterministic test data:
//
// const value = {
//     timestamp: 1_000_000,
//     randomId: "example-id",
// };
//
// Or use property matchers for values whose dynamic nature is intentional.

// ---------------------------------------------------------------------
// 25. Snapshotting dates
// ---------------------------------------------------------------------

// Dates can be deterministic when explicitly constructed:
//
// const user = {
//     name: "John Doe",
//     createdAt: new Date("2026-01-01T00:00:00.000Z"),
// };
//
// expect(user).toMatchSnapshot();
//
// This avoids snapshots changing according to the machine's current time.

// ---------------------------------------------------------------------
// 26. Snapshot testing generated class names
// ---------------------------------------------------------------------

// CSS-in-JS systems or build tools may generate class names:
//
// <div className="component_ab12cd">
//     Content
// </div>
//
// If generated values are unstable, snapshots can become noisy.
//
// The test should avoid depending on generated implementation details when
// those values are not part of the intended contract.

// ---------------------------------------------------------------------
// 27. Snapshot testing and refactoring
// ---------------------------------------------------------------------

// Refactoring can legitimately change a snapshot:
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
// A snapshot test detects the structural change.
//
// The correct response is to determine whether the structural change is
// intentional and compatible with the behavior the test is meant to protect.

// ---------------------------------------------------------------------
// 28. Snapshot review
// ---------------------------------------------------------------------

// A snapshot should be reviewed like any other test expectation:
//
// 1. Read the failing diff.
// 2. Identify what changed.
// 3. Determine whether the change is intentional.
// 4. Check whether the changed behavior is actually important.
// 5. Update the snapshot only when the new output is expected.
//
// Blindly accepting snapshot updates weakens the value of the test.

// ---------------------------------------------------------------------
// 29. Snapshot tests and code review
// ---------------------------------------------------------------------

// Snapshot files are test artifacts and should be reviewed with the code
// changes that produced them.
//
// A useful review asks:
//
// - Why did the snapshot change?
// - Is the changed output intentional?
// - Does the test still verify meaningful behavior?
// - Has unrelated implementation detail entered the snapshot?
//
// A snapshot diff should explain a change rather than merely report that
// something somewhere in the rendered tree changed.

// ---------------------------------------------------------------------
// 30. Snapshot testing versus explicit assertions
// ---------------------------------------------------------------------

// Explicit assertion:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// Snapshot:
//
// expect(container.firstChild).toMatchSnapshot();
//
// Explicit assertions are usually more precise about the intended behavior.
// Snapshots are useful when the complete output structure is itself valuable.
//
// Neither approach is universally appropriate.

// ---------------------------------------------------------------------
// 31. When snapshots are useful
// ---------------------------------------------------------------------

// Snapshots can be useful for:
//
// - Stable serialized data.
// - Small structured outputs.
// - Complex output where the complete representation is meaningful.
// - Detecting accidental changes to generated representations.
// - Regression coverage for intentionally stable structures.
//
// They are less useful when the output is large, highly dynamic, or dominated
// by implementation details.

// ---------------------------------------------------------------------
// 32. When to avoid snapshots
// ---------------------------------------------------------------------

// Avoid snapshot testing when:
//
// - The snapshot becomes very large.
// - The output changes frequently for legitimate reasons.
// - Reviewers cannot easily understand the expected representation.
// - Focused assertions express the behavior more clearly.
// - The snapshot mostly contains implementation details.
// - Dynamic values make the snapshot unstable.
//
// In these situations, targeted assertions can provide a clearer test contract.

// ---------------------------------------------------------------------
// 33. Snapshot testing a complete component
// ---------------------------------------------------------------------

// A complete component snapshot test might look like:
//
// import {render} from "@testing-library/react";
//
// it("matches the user card", () => {
//     const {container} = render(
//         <UserCard
//             name="John Doe"
//             role="User"
//         />,
//     );
//
//     expect(container.firstChild).toMatchSnapshot();
// });
//
// This is intentionally small: the component state and input data are explicit,
// and the snapshot captures one meaningful rendered state.

// ---------------------------------------------------------------------
// 34. Snapshot testing data transformation
// ---------------------------------------------------------------------

// Snapshots can be especially readable for deterministic transformation output:
//
// const input = [
//     {
//         id: "1",
//         name: "John Doe",
//     },
//     {
//         id: "2",
//         name: "Jane Doe",
//     },
// ];
//
// const result = input.map((user) => ({
//     label: user.name,
//     value: user.id,
// }));
//
// expect(result).toMatchSnapshot();
//
// Here the snapshot represents the complete transformed structure rather than
// an entire rendered DOM tree.

// ---------------------------------------------------------------------
// 35. Snapshot testing is not visual regression testing
// ---------------------------------------------------------------------

// A DOM snapshot records serialized structure.
//
// It does not verify:
//
// - Exact pixels.
// - Layout dimensions.
// - Font rendering.
// - Color appearance.
// - Visual alignment.
// - Browser-specific rendering.
//
// Visual regression testing requires a different testing approach, such as
// screenshot comparison with an appropriate browser-testing tool.

// ---------------------------------------------------------------------
// 36. Snapshot testing and component contracts
// ---------------------------------------------------------------------

// A useful snapshot corresponds to a meaningful output contract:
//
// interface StatusProps {
//     readonly status: "loading" | "success" | "error";
// }
//
// The component's rendered representation can be snapshot tested for selected
// stable states:
//
// render(<Status status="success" />);
//
// expect(container.firstChild).toMatchSnapshot();
//
// The test should still avoid snapshotting every incidental wrapper or internal
// implementation detail unless those details are intentionally part of the contract.

// ---------------------------------------------------------------------
// 37. Snapshot tests should be intentional
// ---------------------------------------------------------------------

// Snapshot tests are most effective when the expected output is deliberately
// chosen and reviewed.
//
// Avoid adding:
//
// expect(container).toMatchSnapshot();
//
// simply because a component is difficult to assert against.
//
// First identify what behavior matters. If the complete representation is
// genuinely useful as the expectation, a snapshot can then encode that output.

// ---------------------------------------------------------------------
// 38. Complete inline snapshot pattern
// ---------------------------------------------------------------------

// For small deterministic values:
//
// it("matches the expected summary", () => {
//     const summary = {
//         name: "John Doe",
//         role: "User",
//     };
//
//     expect(summary).toMatchInlineSnapshot(`
//       {
//         "name": "John Doe",
//         "role": "User",
//       }
//     `);
// });
//
// Inline snapshots can be convenient when keeping the expectation directly
// beside the code under test improves readability.

// ---------------------------------------------------------------------
// 39. Snapshot update workflow
// ---------------------------------------------------------------------

// A practical workflow is:
//
// 1. Run the test normally.
// 2. Inspect any snapshot diff.
// 3. Determine why the output changed.
// 4. Fix unexpected changes.
// 5. Update the snapshot for intentional changes.
// 6. Review the resulting snapshot as part of the change.
//
// The update operation should be a deliberate approval step, not an automatic
// response to every snapshot failure.

// ---------------------------------------------------------------------
// 40. Practical guideline
// ---------------------------------------------------------------------

// Prefer this when a specific behavior matters:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// Prefer a snapshot when the complete stable representation matters:
//
// expect(container.firstChild).toMatchSnapshot();
//
// Keep snapshots small, deterministic, intentional, and easy to review.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Snapshot testing compares current output with a previously stored representation.
// - `toMatchSnapshot()` stores the expected representation in a snapshot file.
// - `toMatchInlineSnapshot()` stores the expected representation directly in the test.
// - React DOM can be snapshot tested through Testing Library's rendered container.
// - Snapshot failures indicate that the current representation differs from the stored snapshot.
// - Intentional changes should be reviewed before updating snapshots.
// - `vitest -u` or the corresponding update command can regenerate changed snapshots.
// - Property matchers can prevent dynamic values from making snapshots unstable.
// - Deterministic test data makes snapshots easier to review and maintain.
// - Focused semantic assertions are often clearer than large DOM snapshots.
// - Snapshots should represent meaningful output rather than incidental implementation details.
// - Large or frequently changing snapshots can become noisy and difficult to review.
// - Snapshot tests are not visual regression tests and do not verify pixels or layout.
// - Snapshot diffs should be reviewed as carefully as code changes.
// - The value of a snapshot comes from the stability and meaning of the representation it protects.
