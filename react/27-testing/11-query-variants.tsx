/**
 * Query Variants
 * ==============
 *
 * Testing Library queries come in three main variants: `getBy`, `queryBy`, and `findBy`.
 * Each variant differs in how it handles missing elements and whether it waits for asynchronous
 * changes. The same distinction applies to the corresponding `AllBy` variants for multiple matches.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. The three primary query variants
// ---------------------------------------------------------------------

export const StatusMessage: FC = (): ReactElement => {
  return <p>Profile saved.</p>;
};

// `getBy`:
// - expects the element to exist now
// - returns one matching element
// - throws if no match exists
// - throws if multiple matches exist
//
// `queryBy`:
// - expects zero or one matching element
// - returns `null` when no match exists
// - throws if multiple matches exist
//
// `findBy`:
// - waits for one matching element to appear
// - returns a Promise
// - rejects if the element does not appear within the timeout
// - rejects if multiple matches remain

// ---------------------------------------------------------------------
// 2. getBy
// ---------------------------------------------------------------------

export const GetByExample: FC = (): ReactElement => {
  return <p>Account ready.</p>;
};

// Use `getBy` when the element should already exist:
//
// screen.getByText("Account ready.");

// The query returns the matching element immediately.

// ---------------------------------------------------------------------
// 3. queryBy
// ---------------------------------------------------------------------

export const QueryByExample: FC<{
  readonly showMessage: boolean;
}> = ({ showMessage }): ReactElement | null => {
  return showMessage ? <p>Account ready.</p> : null;
};

// Use `queryBy` when the element may not exist:
//
// screen.queryByText("Account ready.");
//
// If the element is absent, the result is `null` rather than an error.

// ---------------------------------------------------------------------
// 4. findBy
// ---------------------------------------------------------------------

export const FindByExample: FC = (): ReactElement => {
  return <p>Data loaded.</p>;
};

// Use `findBy` when the element is expected to appear asynchronously:
//
// const message = await screen.findByText("Data loaded");
//
// The result is a Promise because Testing Library waits for the element.

// ---------------------------------------------------------------------
// 5. getBy versus queryBy
// ---------------------------------------------------------------------

export const OptionalContent: FC<{
  readonly visible: boolean;
}> = ({ visible }): ReactElement | null => {
  return visible ? <p>Optional content.</p> : null;
};

// When the content must exist:
//
// screen.getByText("Optional content.");
//
// When the content may be absent:
//
// screen.queryByText("Optional content.");

// ---------------------------------------------------------------------
// 6. Asserting presence with getBy
// ---------------------------------------------------------------------

export const RequiredContent: FC = (): ReactElement => {
  return <p>Required content.</p>;
};

// A test can locate required content:
//
// const content = screen.getByText("Required content.");
//
// If the element is missing, `getByText` throws immediately.

// ---------------------------------------------------------------------
// 7. Asserting absence with queryBy
// ---------------------------------------------------------------------

export const AbsentContent: FC = (): ReactElement => {
  return <p>Other content.</p>;
};

// To verify that a particular element is absent:
//
// const content = screen.queryByText("Required content.");
//
// The result is `null` when the text is not present.

// ---------------------------------------------------------------------
// 8. Waiting for asynchronous content with findBy
// ---------------------------------------------------------------------

export const AsyncContent: FC = (): ReactElement => {
  return <p>Content loaded.</p>;
};

// If the content appears after an asynchronous update:
//
// const content = await screen.findByText("Content loaded.");
//
// `findBy` repeatedly checks until the element is found or the wait times out.

// ---------------------------------------------------------------------
// 9. getBy does not wait
// ---------------------------------------------------------------------

export const ImmediateContent: FC = (): ReactElement => {
  return <p>Immediate content.</p>;
};

// `getBy` performs a synchronous query:
//
// screen.getByText("Immediate content.");
//
// It does not wait for a future render.

// ---------------------------------------------------------------------
// 10. queryBy does not wait
// ---------------------------------------------------------------------

export const DelayedContent: FC = (): ReactElement => {
  return <p>Delayed content.</p>;
};

// `queryBy` also performs a synchronous query:
//
// screen.queryByText("Delayed content.");
//
// If the content is not present at the time of the query, it returns `null`.
// It does not wait for the content to appear later.

// ---------------------------------------------------------------------
// 11. findBy waits
// ---------------------------------------------------------------------

export const EventuallyVisible: FC = (): ReactElement => {
  return <p>Eventually visible.</p>;
};

// `findBy` is designed for asynchronous appearance:
//
// const element = await screen.findByText("Eventually visible.");
//
// It waits for the matching element.

// ---------------------------------------------------------------------
// 12. AllBy variants
// ---------------------------------------------------------------------

export const RepeatedContent: FC = (): ReactElement => {
  return (
    <>
      <p>Pending</p>
      <p>Pending</p>
      <p>Pending</p>
    </>
  );
};

// The `AllBy` family is used when multiple matches are expected:
//
// screen.getAllByText("Pending");
//
// screen.queryAllByText("Pending");
//
// await screen.findAllByText("Pending");

// ---------------------------------------------------------------------
// 13. getAllBy
// ---------------------------------------------------------------------

export const RequiredList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Keyboard</li>
      <li>Monitor</li>
    </ul>
  );
};

// `getAllBy` expects at least one matching element:
//
// const items = screen.getAllByRole("listitem");
//
// It throws if no matching elements exist.

// ---------------------------------------------------------------------
// 14. queryAllBy
// ---------------------------------------------------------------------

export const OptionalList: FC<{
  readonly showItems: boolean;
}> = ({ showItems }): ReactElement => {
  return (
    <ul>
      {showItems && (
        <>
          <li>Keyboard</li>
          <li>Monitor</li>
        </>
      )}
    </ul>
  );
};

// `queryAllBy` is useful when zero or more matches are expected:
//
// const items = screen.queryAllByRole("listitem");
//
// An empty array means there are no matches.

// ---------------------------------------------------------------------
// 15. findAllBy
// ---------------------------------------------------------------------

export const AsyncList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Keyboard</li>
      <li>Monitor</li>
    </ul>
  );
};

// `findAllBy` waits for multiple matching elements:
//
// const items = await screen.findAllByRole("listitem");

// ---------------------------------------------------------------------
// 16. Query variant matrix
// ---------------------------------------------------------------------

export interface QueryVariant {
  readonly variant: string;
  readonly matches: string;
  readonly asynchronous: string;
  readonly missingResult: string;
}

export const queryVariants: readonly QueryVariant[] = [
  {
    variant: "getBy",
    matches: "Exactly one",
    asynchronous: "No",
    missingResult: "Throws",
  },
  {
    variant: "queryBy",
    matches: "Zero or one",
    asynchronous: "No",
    missingResult: "Returns null",
  },
  {
    variant: "findBy",
    matches: "Exactly one",
    asynchronous: "Yes",
    missingResult: "Rejects after timeout",
  },
  {
    variant: "getAllBy",
    matches: "One or more",
    asynchronous: "No",
    missingResult: "Throws",
  },
  {
    variant: "queryAllBy",
    matches: "Zero or more",
    asynchronous: "No",
    missingResult: "Returns []",
  },
  {
    variant: "findAllBy",
    matches: "One or more",
    asynchronous: "Yes",
    missingResult: "Rejects after timeout",
  },
];

// ---------------------------------------------------------------------
// 17. Query variant naming
// ---------------------------------------------------------------------

export interface QueryNaming {
  readonly baseQuery: string;
  readonly synchronousSingle: string;
  readonly synchronousOptional: string;
  readonly asynchronousSingle: string;
}

export const queryNaming: readonly QueryNaming[] = [
  {
    baseQuery: "Text",
    synchronousSingle: "getByText",
    synchronousOptional: "queryByText",
    asynchronousSingle: "findByText",
  },
  {
    baseQuery: "Role",
    synchronousSingle: "getByRole",
    synchronousOptional: "queryByRole",
    asynchronousSingle: "findByRole",
  },
  {
    baseQuery: "LabelText",
    synchronousSingle: "getByLabelText",
    synchronousOptional: "queryByLabelText",
    asynchronousSingle: "findByLabelText",
  },
  {
    baseQuery: "TestId",
    synchronousSingle: "getByTestId",
    synchronousOptional: "queryByTestId",
    asynchronousSingle: "findByTestId",
  },
];

// The same variant rules apply across Testing Library's query families.

// ---------------------------------------------------------------------
// 18. getBy with multiple matches
// ---------------------------------------------------------------------

export const DuplicateContent: FC = (): ReactElement => {
  return (
    <>
      <p>Ready</p>
      <p>Ready</p>
    </>
  );
};

// This is ambiguous:
//
// screen.getByText("Ready");
//
// `getBy` expects exactly one matching element.

// ---------------------------------------------------------------------
// 19. queryBy with multiple matches
// ---------------------------------------------------------------------

export const DuplicateOptionalContent: FC = (): ReactElement => {
  return (
    <>
      <p>Ready</p>
      <p>Ready</p>
    </>
  );
};

// `queryBy` does not mean "return the first match":
//
// screen.queryByText("Ready");
//
// It still throws when multiple elements match.

// ---------------------------------------------------------------------
// 20. findBy with multiple matches
// ---------------------------------------------------------------------

export const DuplicateAsyncContent: FC = (): ReactElement => {
  return (
    <>
      <p>Ready</p>
      <p>Ready</p>
    </>
  );
};

// `findBy` also expects one matching element:
//
// await screen.findByText("Ready");
//
// Multiple matches are still considered an error.

// ---------------------------------------------------------------------
// 21. getAllBy with no matches
// ---------------------------------------------------------------------

export const EmptyList: FC = (): ReactElement => {
  return <ul />;
};

// `getAllBy` requires at least one match:
//
// screen.getAllByRole("listitem");
//
// No matching elements cause the query to throw.

// ---------------------------------------------------------------------
// 22. queryAllBy with no matches
// ---------------------------------------------------------------------

export const EmptyOptionalList: FC = (): ReactElement => {
  return <ul />;
};

// `queryAllBy` permits zero matches:
//
// const items = screen.queryAllByRole("listitem");
//
// `items` is an empty array.

// ---------------------------------------------------------------------
// 23. findAllBy with asynchronous matches
// ---------------------------------------------------------------------

export const AsyncItems: FC = (): ReactElement => {
  return (
    <ul>
      <li>First</li>
      <li>Second</li>
    </ul>
  );
};

// `findAllBy` waits for the collection:
//
// const items = await screen.findAllByRole("listitem");

// ---------------------------------------------------------------------
// 24. getBy for static UI
// ---------------------------------------------------------------------

export const StaticPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>Manage your account.</p>
    </main>
  );
};

// Static content that should already exist can use `getBy`:
//
// screen.getByRole(
//     "heading",
//     {name: "Account"},
// );

// ---------------------------------------------------------------------
// 25. queryBy for conditional UI
// ---------------------------------------------------------------------

export const ConditionalMessage: FC<{
  readonly error: boolean;
}> = ({ error }): ReactElement | null => {
  return error ? <p role="alert">Unable to save changes.</p> : null;
};

// If an error is not expected:
//
// expect(
//     screen.queryByRole(
//         "alert",
//     ),
// ).toBeNull();

// ---------------------------------------------------------------------
// 26. findBy for asynchronous UI
// ---------------------------------------------------------------------

export const LoadedMessage: FC = (): ReactElement => {
  return <p>Profile loaded.</p>;
};

// If the message is produced after an asynchronous operation:
//
// await screen.findByText("Profile loaded.");

// ---------------------------------------------------------------------
// 27. Do not use findBy for ordinary synchronous content
// ---------------------------------------------------------------------

export const SynchronousMessage: FC = (): ReactElement => {
  return <p>Profile ready.</p>;
};

// If the element is already present, this is unnecessary:
//
// await screen.findByText("Profile ready.");
//
// Prefer:
//
// screen.getByText("Profile ready.");
//
// `findBy` introduces asynchronous waiting that the test does not need.

// ---------------------------------------------------------------------
// 28. Do not use queryBy for required content
// ---------------------------------------------------------------------

export const RequiredMessage: FC = (): ReactElement => {
  return <p>Profile ready.</p>;
};

// If the element must exist:
//
// screen.getByText("Profile ready.");
//
// Using `queryByText` would require a separate assertion and makes the
// intent less direct.

// ---------------------------------------------------------------------
// 29. queryBy for absence
// ---------------------------------------------------------------------

export const NoError: FC = (): ReactElement => {
  return <p>Saved successfully.</p>;
};

// Absence is a natural use case for `queryBy`:
//
// screen.queryByRole("alert");
//
// The result is `null` when no alert exists.

// ---------------------------------------------------------------------
// 30. findBy for appearance
// ---------------------------------------------------------------------

export const SuccessMessage: FC = (): ReactElement => {
  return <p role="status">Changes saved.</p>;
};

// When the status appears after an asynchronous operation:
//
// await screen.findByRole(
//     "status",
//     {name: "Changes saved."},
// );

// ---------------------------------------------------------------------
// 31. getBy and immediate assertions
// ---------------------------------------------------------------------

export const ImmediateStatus: FC = (): ReactElement => {
  return <p role="status">Ready.</p>;
};

// A synchronous query directly obtains the element:
//
// const status = screen.getByRole(
//     "status",
//     {name: "Ready."},
// );

// ---------------------------------------------------------------------
// 32. queryBy and absence assertions
// ---------------------------------------------------------------------

export const NoStatus: FC = (): ReactElement => {
  return <p>Nothing to report.</p>;
};

// A test can explicitly assert that a status does not exist:
//
// const status = screen.queryByRole("status");
//
// expect(status).toBeNull();

// ---------------------------------------------------------------------
// 33. findBy and asynchronous assertions
// ---------------------------------------------------------------------

export const AsyncStatusMessage: FC = (): ReactElement => {
  return <p role="status">Processing complete.</p>;
};

// An asynchronous test can wait for the status:
//
// const status = await screen.findByRole(
//     "status",
//     {name: "Processing complete."},
// );

// ---------------------------------------------------------------------
// 34. getBy with text
// ---------------------------------------------------------------------

export const TextExample: FC = (): ReactElement => {
  return <p>Welcome back.</p>;
};

// screen.getByText("Welcome back.");

// ---------------------------------------------------------------------
// 35. queryBy with text
// ---------------------------------------------------------------------

export const OptionalTextExample: FC = (): ReactElement => {
  return <p>Welcome back.</p>;
};

// screen.queryByText("Welcome back.");

// ---------------------------------------------------------------------
// 36. findBy with text
// ---------------------------------------------------------------------

export const AsyncTextExample: FC = (): ReactElement => {
  return <p>Welcome back.</p>;
};

// await screen.findByText("Welcome back.");

// ---------------------------------------------------------------------
// 37. getBy with roles
// ---------------------------------------------------------------------

export const RoleExample: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 38. queryBy with roles
// ---------------------------------------------------------------------

export const OptionalRoleExample: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// screen.queryByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 39. findBy with roles
// ---------------------------------------------------------------------

export const AsyncRoleExample: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// await screen.findByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 40. getBy with labels
// ---------------------------------------------------------------------

export const LabelExample: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// screen.getByLabelText("Email");

// ---------------------------------------------------------------------
// 41. queryBy with labels
// ---------------------------------------------------------------------

export const OptionalLabelExample: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// screen.queryByLabelText("Email");

// ---------------------------------------------------------------------
// 42. findBy with labels
// ---------------------------------------------------------------------

export const AsyncLabelExample: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// await screen.findByLabelText("Email");

// ---------------------------------------------------------------------
// 43. getBy with test IDs
// ---------------------------------------------------------------------

export const TestIdExample: FC = (): ReactElement => {
  return <div data-testid="account-panel">Account</div>;
};

// screen.getByTestId("account-panel");

// ---------------------------------------------------------------------
// 44. queryBy with test IDs
// ---------------------------------------------------------------------

export const OptionalTestIdExample: FC = (): ReactElement => {
  return <div data-testid="account-panel">Account</div>;
};

// screen.queryByTestId("account-panel");

// ---------------------------------------------------------------------
// 45. findBy with test IDs
// ---------------------------------------------------------------------

export const AsyncTestIdExample: FC = (): ReactElement => {
  return <div data-testid="account-panel">Account</div>;
};

// await screen.findByTestId("account-panel");

// ---------------------------------------------------------------------
// 46. The `getBy` failure model
// ---------------------------------------------------------------------

export interface GetByBehavior {
  readonly condition: string;
  readonly behavior: string;
}

export const getByBehavior: readonly GetByBehavior[] = [
  {
    condition: "One match",
    behavior: "Returns the element",
  },
  {
    condition: "No matches",
    behavior: "Throws",
  },
  {
    condition: "Multiple matches",
    behavior: "Throws",
  },
];

// ---------------------------------------------------------------------
// 47. The `queryBy` failure model
// ---------------------------------------------------------------------

export interface QueryByBehavior {
  readonly condition: string;
  readonly behavior: string;
}

export const queryByBehavior: readonly QueryByBehavior[] = [
  {
    condition: "One match",
    behavior: "Returns the element",
  },
  {
    condition: "No matches",
    behavior: "Returns null",
  },
  {
    condition: "Multiple matches",
    behavior: "Throws",
  },
];

// ---------------------------------------------------------------------
// 48. The `findBy` failure model
// ---------------------------------------------------------------------

export interface FindByBehavior {
  readonly condition: string;
  readonly behavior: string;
}

export const findByBehavior: readonly FindByBehavior[] = [
  {
    condition: "One match appears",
    behavior: "Resolves with the element",
  },
  {
    condition: "No match appears before timeout",
    behavior: "Rejects",
  },
  {
    condition: "Multiple matches remain",
    behavior: "Rejects",
  },
];

// ---------------------------------------------------------------------
// 49. The `AllBy` failure model
// ---------------------------------------------------------------------

export interface AllByBehavior {
  readonly variant: string;
  readonly zeroMatches: string;
  readonly multipleMatches: string;
}

export const allByBehavior: readonly AllByBehavior[] = [
  {
    variant: "getAllBy",
    zeroMatches: "Throws",
    multipleMatches: "Returns all matches",
  },
  {
    variant: "queryAllBy",
    zeroMatches: "Returns []",
    multipleMatches: "Returns all matches",
  },
  {
    variant: "findAllBy",
    zeroMatches: "Waits, then rejects if none appear",
    multipleMatches: "Resolves with all matches",
  },
];

// ---------------------------------------------------------------------
// 50. `findBy` is not simply an asynchronous `queryBy`
// ---------------------------------------------------------------------

export const EventuallyRendered: FC = (): ReactElement => {
  return <p>Loaded.</p>;
};

// Conceptually:
//
// queryBy -> check now
// findBy  -> wait for the condition
//
// `findBy` is intended for asynchronous appearance rather than merely
// converting a synchronous query into a Promise.

// ---------------------------------------------------------------------
// 51. `findBy` timeout
// ---------------------------------------------------------------------

export interface FindByTimeoutExample {
  readonly query: string;
  readonly behavior: string;
}

export const findByTimeoutExample: FindByTimeoutExample = {
  query: 'screen.findByText("Loaded")',
  behavior: "Waits until the query succeeds or the configured timeout is reached",
};

// `findBy` does not wait forever.

// ---------------------------------------------------------------------
// 52. Query variants and async state changes
// ---------------------------------------------------------------------

export const AsyncState: FC = (): ReactElement => {
  return (
    <section>
      <p>Data loaded.</p>
    </section>
  );
};

// A synchronous query checks the current DOM:
//
// screen.getByText("Data loaded.");
//
// An asynchronous query waits for the DOM to reach the expected state:
//
// await screen.findByText("Data loaded.");

// ---------------------------------------------------------------------
// 53. Query variants and absence after an update
// ---------------------------------------------------------------------

export const RemovedMessage: FC = (): ReactElement => {
  return <p>Message removed.</p>;
};

// To verify that an element is absent:
//
// screen.queryByText("Old message");
//
// `queryBy` is the appropriate variant for checking absence at the
// current point in the test.

// ---------------------------------------------------------------------
// 54. Do not use getBy to test absence
// ---------------------------------------------------------------------

export const AbsentElement: FC = (): ReactElement => {
  return <p>Visible content.</p>;
};

// This is incorrect for an absence assertion:
//
// screen.getByText("Missing content");
//
// The query itself throws.
//
// Use:
//
// screen.queryByText("Missing content");

// ---------------------------------------------------------------------
// 55. Do not use queryBy to wait
// ---------------------------------------------------------------------

export const FutureElement: FC = (): ReactElement => {
  return <p>Future content.</p>;
};

// This does not wait:
//
// screen.queryByText("Future content");
//
// If the content is expected to appear asynchronously:
//
// await screen.findByText("Future content");

// ---------------------------------------------------------------------
// 56. Do not use getBy to wait
// ---------------------------------------------------------------------

export const FutureStatus: FC = (): ReactElement => {
  return <p role="status">Finished.</p>;
};

// This does not wait:
//
// screen.getByRole(
//     "status",
//     {name: "Finished."},
// );
//
// Use:
//
// await screen.findByRole(
//     "status",
//     {name: "Finished."},
// );

// ---------------------------------------------------------------------
// 57. Do not use findBy for absence
// ---------------------------------------------------------------------

export const AbsentAsyncElement: FC = (): ReactElement => {
  return <p>Other content.</p>;
};

// `findBy` waits for an element to appear, so it is not the appropriate
// query when the requirement is that an element remains absent.
//
// Use:
//
// screen.queryByText("Unexpected content");

// ---------------------------------------------------------------------
// 58. Query variant decision
// ---------------------------------------------------------------------

export interface QueryDecision {
  readonly question: string;
  readonly variant: string;
}

export const queryDecisions: readonly QueryDecision[] = [
  {
    question: "Should exactly one element exist right now?",
    variant: "getBy",
  },
  {
    question: "May the element be absent right now?",
    variant: "queryBy",
  },
  {
    question: "Should one element appear asynchronously?",
    variant: "findBy",
  },
  {
    question: "Should one or more elements exist right now?",
    variant: "getAllBy",
  },
  {
    question: "May zero or more elements exist right now?",
    variant: "queryAllBy",
  },
  {
    question: "Should multiple elements appear asynchronously?",
    variant: "findAllBy",
  },
];

// ---------------------------------------------------------------------
// 59. Query variants with semantic queries
// ---------------------------------------------------------------------

export const SemanticStatus: FC = (): ReactElement => {
  return <p role="status">Saved.</p>;
};

// The variant applies to the query family:
//
// screen.getByRole("status", {name: "Saved."});
//
// screen.queryByRole("status", {name: "Saved."});
//
// await screen.findByRole("status", {name: "Saved."});

// ---------------------------------------------------------------------
// 60. Query variants with text queries
// ---------------------------------------------------------------------

export const TextStatus: FC = (): ReactElement => {
  return <p>Saved.</p>;
};

// The same variant pattern applies:
//
// screen.getByText("Saved.");
//
// screen.queryByText("Saved.");
//
// await screen.findByText("Saved.");

// ---------------------------------------------------------------------
// 61. Query variants with test IDs
// ---------------------------------------------------------------------

export const TestIdStatus: FC = (): ReactElement => {
  return <p data-testid="status">Saved.</p>;
};

// The same variant pattern applies:
//
// screen.getByTestId("status");
//
// screen.queryByTestId("status");
//
// await screen.findByTestId("status");

// ---------------------------------------------------------------------
// 62. Query variants with labels
// ---------------------------------------------------------------------

export const LabeledField: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// Again, the variant communicates timing and expected presence:
//
// screen.getByLabelText("Email");
//
// screen.queryByLabelText("Email");
//
// await screen.findByLabelText("Email");

// ---------------------------------------------------------------------
// 63. Query variants are orthogonal to query strategy
// ---------------------------------------------------------------------

export interface QueryDimensions {
  readonly dimension: string;
  readonly values: string;
}

export const queryDimensions: readonly QueryDimensions[] = [
  {
    dimension: "How to identify the element",
    values: "Role, label, text, test ID, and other query families",
  },
  {
    dimension: "How many elements are expected",
    values: "One or many",
  },
  {
    dimension: "When the element should exist",
    values: "Now or asynchronously",
  },
];

// Choosing a query therefore involves two separate questions:
// how should the element be identified, and when/how many matches are expected?

// ---------------------------------------------------------------------
// 64. Complete synchronous example
// ---------------------------------------------------------------------

export const SynchronousExample: FC = (): ReactElement => {
  return (
    <section>
      <h1>Account</h1>
      <p>Profile ready.</p>
    </section>
  );
};

// The expected content is already rendered:
//
// screen.getByRole(
//     "heading",
//     {name: "Account"},
// );
//
// screen.getByText("Profile ready.");

// ---------------------------------------------------------------------
// 65. Complete absence example
// ---------------------------------------------------------------------

export const AbsenceExample: FC = (): ReactElement => {
  return (
    <section>
      <h1>Account</h1>
    </section>
  );
};

// The test expects no status message:
//
// expect(
//     screen.queryByRole("status"),
// ).toBeNull();

// ---------------------------------------------------------------------
// 66. Complete asynchronous example
// ---------------------------------------------------------------------

export const AsyncExample: FC = (): ReactElement => {
  return (
    <section>
      <p role="status">Profile loaded.</p>
    </section>
  );
};

// The test waits for the status:
//
// const status = await screen.findByRole(
//     "status",
//     {name: "Profile loaded."},
// );

// ---------------------------------------------------------------------
// 67. Choosing between variants
// ---------------------------------------------------------------------

export interface VariantRule {
  readonly situation: string;
  readonly recommendedVariant: string;
}

export const variantRules: readonly VariantRule[] = [
  {
    situation: "Required synchronous element",
    recommendedVariant: "getBy",
  },
  {
    situation: "Optional or absent synchronous element",
    recommendedVariant: "queryBy",
  },
  {
    situation: "Required asynchronous element",
    recommendedVariant: "findBy",
  },
  {
    situation: "Required synchronous collection",
    recommendedVariant: "getAllBy",
  },
  {
    situation: "Optional synchronous collection",
    recommendedVariant: "queryAllBy",
  },
  {
    situation: "Required asynchronous collection",
    recommendedVariant: "findAllBy",
  },
];

// ---------------------------------------------------------------------
// 68. A practical example
// ---------------------------------------------------------------------

export const AccountPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>Welcome, John Doe.</p>
      <button type="button">Edit profile</button>
    </main>
  );
};

// Synchronous required content:
//
// screen.getByRole(
//     "heading",
//     {name: "Account"},
// );
//
// screen.getByText("Welcome, John Doe.");
//
// screen.getByRole(
//     "button",
//     {name: "Edit profile"},
// );

// ---------------------------------------------------------------------
// 69. Practical absence example
// ---------------------------------------------------------------------

export const AccountWithoutError: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>Account is ready.</p>
    </main>
  );
};

// An error should not be present:
//
// expect(
//     screen.queryByRole("alert"),
// ).toBeNull();

// ---------------------------------------------------------------------
// 70. Practical asynchronous example
// ---------------------------------------------------------------------

export const AccountAfterLoad: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>Account data loaded.</p>
    </main>
  );
};

// When account data is expected after asynchronous work:
//
// await screen.findByText("Account data loaded.");

// ---------------------------------------------------------------------
// 71. Variant selection checklist
// ---------------------------------------------------------------------

export interface VariantChecklistItem {
  readonly question: string;
  readonly answer: string;
}

export const variantChecklist: readonly VariantChecklistItem[] = [
  {
    question: "Must the element exist now?",
    answer: "Use a `getBy` query.",
  },
  {
    question: "Can the element be absent?",
    answer: "Use a `queryBy` query.",
  },
  {
    question: "Will the element appear asynchronously?",
    answer: "Use a `findBy` query.",
  },
  {
    question: "Are multiple elements expected?",
    answer: "Use the corresponding `AllBy` variant.",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Testing Library query variants determine how a query handles presence, absence, multiplicity, and asynchronous appearance.
// - `getBy` expects exactly one matching element to exist synchronously and throws when the result is missing or ambiguous.
// - `queryBy` expects zero or one matching element synchronously and returns `null` when no match exists.
// - `findBy` waits asynchronously for exactly one matching element and returns a Promise.
// - `getAllBy` expects one or more matching elements and throws when there are none.
// - `queryAllBy` allows zero or more matching elements and returns an empty array when there are none.
// - `findAllBy` waits asynchronously for one or more matching elements.
// - `getBy` is appropriate for required content that should already be rendered.
// - `queryBy` is appropriate for checking whether optional content is absent.
// - `findBy` is appropriate when required content appears after asynchronous work.
// - `getBy` and `queryBy` do not wait for future DOM changes.
// - `findBy` and `findAllBy` are designed for asynchronous appearance and timeout if the expected condition is not met.
// - The same variant pattern applies across query families such as role, text, label, and test ID queries.
// - `queryBy` does not mean "return the first match"; it still throws when multiple elements match.
// - `getBy` should not be used to test absence because a missing element causes the query itself to throw.
// - `queryBy` should not be used when the test needs to wait for an element to appear.
// - `findBy` should not be used merely because a query can return a Promise; use it when asynchronous waiting is actually required.
// - Choose the `By` family according to how the element should be identified and choose the variant according to expected cardinality and timing.
