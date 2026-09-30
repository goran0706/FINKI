/**
 * Render
 * ======
 *
 * React Testing Library's `render` function mounts a React element into a DOM
 * container so that tests can interact with and inspect the resulting UI.
 * It provides bound queries and utilities such as `container`, `baseElement`,
 * `rerender`, `unmount`, and `asFragment` for working with the rendered tree.
 */

import { type FC, type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";

// ---------------------------------------------------------------------
// 1. The render function
// ---------------------------------------------------------------------

// `render` accepts a React element and mounts it into a DOM container.
//
// render(<Greeting name="John Doe" />)
//
// By default, React Testing Library creates a container and appends it
// to `document.body`.

export interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

// The component is rendered into the test DOM:
//
// render(<Greeting name="John Doe" />);

// ---------------------------------------------------------------------
// 2. What render does
// ---------------------------------------------------------------------

// Conceptually, `render`:
//
// 1. creates or uses a DOM container
// 2. mounts the React element into that container
// 3. returns utilities for querying and managing the rendered tree
//
// The result represents the mounted test environment rather than
// the component instance.

export interface RenderConcept {
  readonly step: string;
  readonly responsibility: string;
}

export const renderConcept: readonly RenderConcept[] = [
  {
    step: "Input",
    responsibility: "A React element is supplied to render",
  },
  {
    step: "Mount",
    responsibility: "React mounts the element into the test DOM",
  },
  {
    step: "Result",
    responsibility: "Testing utilities are returned for the rendered tree",
  },
];

// ---------------------------------------------------------------------
// 3. Basic render usage
// ---------------------------------------------------------------------

export const basicRenderExample = (): RenderResult => {
  return render(<Greeting name="John Doe" />);
};

// The returned RenderResult contains the rendered tree's container,
// base element, bound queries, and lifecycle utilities.

// ---------------------------------------------------------------------
// 4. Render is an Arrange operation
// ---------------------------------------------------------------------

// In a typical test:
//
// Arrange:
// render(<Greeting name="John Doe" />)
//
// Act:
// perform an interaction
//
// Assert:
// verify the resulting behavior
//
// Rendering normally belongs to Arrange because it establishes
// the initial UI state for the test.

export interface RenderPhase {
  readonly phase: "Arrange" | "Act" | "Assert";
  readonly example: string;
}

export const renderPhase: RenderPhase = {
  phase: "Arrange",
  example: 'render(<Greeting name="John Doe" />)',
};

// ---------------------------------------------------------------------
// 5. Rendering does not assert anything
// ---------------------------------------------------------------------

// `render` only establishes the UI under test.
//
// It does not determine whether the component behaves correctly.
//
// A test still needs a query and an assertion:
//
// render(<Greeting name="John Doe" />)
// expect(screen.getByRole("heading", {name: "Hello, John Doe"}))
//     .toBeInTheDocument();

// Rendering and asserting are separate responsibilities.

// ---------------------------------------------------------------------
// 6. RenderResult
// ---------------------------------------------------------------------

// `render` returns a RenderResult.
//
// The result contains:
//
// - bound queries
// - container
// - baseElement
// - debug
// - rerender
// - unmount
// - asFragment

export interface RenderResultPart {
  readonly property: string;
  readonly purpose: string;
}

export const renderResultParts: readonly RenderResultPart[] = [
  {
    property: "Queries",
    purpose: "Find elements in the rendered UI",
  },
  {
    property: "container",
    purpose: "Access the DOM node containing the rendered React tree",
  },
  {
    property: "baseElement",
    purpose: "Access the broader DOM base used by the render result",
  },
  {
    property: "debug",
    purpose: "Print the rendered DOM for inspection",
  },
  {
    property: "rerender",
    purpose: "Render the same component again with updated props",
  },
  {
    property: "unmount",
    purpose: "Remove the rendered React tree",
  },
  {
    property: "asFragment",
    purpose: "Capture the current rendered DOM as a DocumentFragment",
  },
];

// ---------------------------------------------------------------------
// 7. Bound queries
// ---------------------------------------------------------------------

// The render result includes queries bound to the rendered base element.
//
// Example:
//
// const {getByRole} = render(<Greeting name="John Doe" />)
//
// getByRole("heading", {name: "Hello, John Doe"})
//
// In many tests, `screen` is preferred for querying the document because
// it makes the test's query target explicit and avoids destructuring
// individual queries from the render result.

// ---------------------------------------------------------------------
// 8. Render with screen
// ---------------------------------------------------------------------

// A common pattern is:
//
// render(<Greeting name="John Doe" />)
//
// screen.getByRole("heading", {
//     name: "Hello, John Doe",
// })
//
// `screen` is provided by Testing Library and queries the document
// containing the rendered component.

// ---------------------------------------------------------------------
// 9. Render with returned queries
// ---------------------------------------------------------------------

export const renderWithReturnedQuery = (): RenderResult => {
  return render(<Greeting name="John Doe" />);
};

// Conceptually:
//
// const {getByRole} = render(<Greeting name="John Doe" />)
//
// getByRole("heading", {
//     name: "Hello, John Doe",
// })
//
// This is valid, although `screen` is often clearer when the test
// is intentionally querying the document.

// ---------------------------------------------------------------------
// 10. container
// ---------------------------------------------------------------------

// `container` is the DOM element into which React Testing Library
// renders the React tree.
//
// By default, the library creates a `div` and appends it to `document.body`.

export interface ContainerDescription {
  readonly property: string;
  readonly meaning: string;
}

export const containerDescription: ContainerDescription = {
  property: "container",
  meaning: "The DOM node containing the rendered React tree",
};

// ---------------------------------------------------------------------
// 11. container is a real DOM node
// ---------------------------------------------------------------------

// `container` can be inspected with ordinary DOM APIs:
//
// const {container} = render(<Greeting name="John Doe" />)
//
// container.querySelector("h1")
//
// However, direct DOM selectors should not normally be the first choice
// for finding elements in a behavior-focused test.

// ---------------------------------------------------------------------
// 12. Prefer queries over container.querySelector
// ---------------------------------------------------------------------

export interface ContainerQueryGuideline {
  readonly approach: string;
  readonly guidance: string;
}

export const containerQueryGuideline: readonly ContainerQueryGuideline[] = [
  {
    approach: "getByRole",
    guidance: "Preferred when the element has meaningful accessible semantics",
  },
  {
    approach: "getByLabelText",
    guidance: "Preferred for labelled form controls",
  },
  {
    approach: "getByText",
    guidance: "Useful for visible text",
  },
  {
    approach: "container.querySelector",
    guidance: "Use only when a Testing Library query does not represent the behavior well",
  },
];

// Testing Library explicitly recommends reconsidering direct `container`
// queries when a more resilient query is available. :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 13. baseElement
// ---------------------------------------------------------------------

// `baseElement` is the DOM node used as the base for the render result.
//
// When no custom container is provided, it defaults to `document.body`.

export interface BaseElementDescription {
  readonly property: string;
  readonly defaultValue: string;
}

export const baseElementDescription: BaseElementDescription = {
  property: "baseElement",
  defaultValue: "document.body",
};

// `baseElement` becomes particularly useful when the tested component
// renders content outside the normal render container, such as a portal.

// ---------------------------------------------------------------------
// 14. container vs baseElement
// ---------------------------------------------------------------------

export interface ContainerComparison {
  readonly property: string;
  readonly scope: string;
}

export const containerComparison: readonly ContainerComparison[] = [
  {
    property: "container",
    scope: "The specific DOM node used to mount the React tree",
  },
  {
    property: "baseElement",
    scope: "The broader DOM base used by the render result",
  },
];

// The distinction matters when rendered content exists outside
// the normal container.

// ---------------------------------------------------------------------
// 15. Rendering a fragment
// ---------------------------------------------------------------------

export const FragmentExample: FC = (): ReactElement => {
  return (
    <>
      <h2>First item</h2>
      <p>Second item</p>
    </>
  );
};

// React fragments do not create an additional DOM element.
//
// The render container still exists around the rendered React tree,
// but the fragment itself is not represented as a DOM element.

// ---------------------------------------------------------------------
// 16. container.firstChild
// ---------------------------------------------------------------------

// When the rendered component has a single root element:
//
// const {container} = render(<Greeting name="John Doe" />)
//
// container.firstChild
//
// refers to the rendered root DOM node.
//
// With a React Fragment, `firstChild` refers only to the first child,
// because the Fragment itself has no DOM representation.

// ---------------------------------------------------------------------
// 17. debug
// ---------------------------------------------------------------------

// The render result provides `debug` for inspecting the rendered DOM.
//
// const {debug} = render(<Greeting name="John Doe" />)
// debug()
//
// It is primarily a development and troubleshooting utility.
// Testing Library recommends `screen.debug()` for routine DOM debugging.

export interface DebugPurpose {
  readonly utility: string;
  readonly purpose: string;
}

export const debugPurpose: DebugPurpose = {
  utility: "debug",
  purpose: "Inspect the current rendered DOM when diagnosing a test",
};

// ---------------------------------------------------------------------
// 18. screen.debug
// ---------------------------------------------------------------------

// `screen.debug()` prints the DOM associated with the document.
//
// It is often more convenient than destructuring `debug`:
//
// render(<Greeting name="John Doe" />)
// screen.debug()
//
// The rendered DOM is useful for understanding what the test actually
// has available to query.

// ---------------------------------------------------------------------
// 19. rerender
// ---------------------------------------------------------------------

// `rerender` renders the same component again with updated props.
//
// Example:
//
// const {rerender} = render(
//     <Greeting name="John Doe" />,
// )
//
// rerender(
//     <Greeting name="Jane Doe" />,
// )
//
// The existing render environment is reused rather than creating
// a second independent render.

// ---------------------------------------------------------------------
// 20. When rerender is useful
// ---------------------------------------------------------------------

export interface RerenderScenario {
  readonly initialProps: string;
  readonly updatedProps: string;
  readonly behavior: string;
}

export const rerenderScenario: RerenderScenario = {
  initialProps: 'name="John Doe"',
  updatedProps: 'name="Jane Doe"',
  behavior: "Verify that the component responds correctly to changed props",
};

// Rerender is useful when the behavior being tested specifically concerns
// how a component responds to prop changes.

// ---------------------------------------------------------------------
// 21. Rerender does not mean remount
// ---------------------------------------------------------------------

// `rerender` updates the existing rendered tree.
//
// This is different from:
//
// render(<Component />)
// render(<Component />)
//
// Calling `render` twice creates two render trees.
// Calling `rerender` updates the existing render.

export interface RenderComparison {
  readonly operation: string;
  readonly effect: string;
}

export const renderComparison: readonly RenderComparison[] = [
  {
    operation: "render(...)",
    effect: "Creates a new render tree",
  },
  {
    operation: "rerender(...)",
    effect: "Updates the existing render tree",
  },
];

// ---------------------------------------------------------------------
// 22. Rerender example
// ---------------------------------------------------------------------

export interface GreetingUpdateProps {
  readonly name: string;
}

export const GreetingUpdate: FC<GreetingUpdateProps> = ({ name }): ReactElement => {
  return <h1>Hello, {name}</h1>;
};

// Conceptually:
//
// const {rerender} = render(
//     <GreetingUpdate name="John Doe" />,
// )
//
// expect(
//     screen.getByRole("heading", {name: "Hello, John Doe"}),
// ).toBeInTheDocument()
//
// rerender(
//     <GreetingUpdate name="Jane Doe" />,
// )
//
// expect(
//     screen.getByRole("heading", {name: "Hello, Jane Doe"}),
// ).toBeInTheDocument()

// ---------------------------------------------------------------------
// 23. Prefer testing the parent that changes props
// ---------------------------------------------------------------------

// Testing Library notes that it is often better to test the component
// responsible for updating props rather than manually calling `rerender`.
// Manual rerendering is still useful when the prop-update behavior itself
// is the subject of the test. :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 24. unmount
// ---------------------------------------------------------------------

// `unmount` removes the rendered React tree.
//
// const {unmount} = render(<Greeting name="John Doe" />)
//
// unmount()
//
// It is useful when the test specifically needs to verify cleanup behavior,
// such as removing subscriptions or event listeners.

// ---------------------------------------------------------------------
// 25. Unmount behavior
// ---------------------------------------------------------------------

export interface UnmountScenario {
  readonly setup: string;
  readonly action: string;
  readonly assertion: string;
}

export const unmountScenario: UnmountScenario = {
  setup: "Render a component that registers an external resource",
  action: "Unmount the component",
  assertion: "The resource is cleaned up",
};

// Unmounting tests the component's removal from the rendered tree,
// not merely whether a DOM node happens to disappear.

// ---------------------------------------------------------------------
// 26. asFragment
// ---------------------------------------------------------------------

// `asFragment` returns a DocumentFragment representing the current
// rendered DOM.
//
// const {asFragment} = render(<Greeting name="John Doe" />)
//
// const initial = asFragment()
//
// It can be useful when a test needs to capture a snapshot of the
// current DOM state independently from the live DOM.

// ---------------------------------------------------------------------
// 27. asFragment and state changes
// ---------------------------------------------------------------------

export interface FragmentSnapshot {
  readonly stage: string;
  readonly purpose: string;
}

export const fragmentSnapshots: readonly FragmentSnapshot[] = [
  {
    stage: "Before interaction",
    purpose: "Capture the initial rendered state",
  },
  {
    stage: "After interaction",
    purpose: "Capture the resulting rendered state",
  },
];

// `asFragment` can be used to compare DOM states before and after
// an interaction, although behavior-oriented assertions are usually
// preferable to broad snapshots.

// ---------------------------------------------------------------------
// 28. cleanup
// ---------------------------------------------------------------------

// `cleanup` unmounts React trees that were mounted with `render`.
//
// Testing Library automatically performs cleanup when the testing framework
// provides the appropriate `afterEach` lifecycle hook.
//
// If the environment does not provide automatic cleanup, it can be called
// explicitly after each test. :contentReference[oaicite:2]{index=2}

// ---------------------------------------------------------------------
// 29. Why cleanup matters
// ---------------------------------------------------------------------

export interface CleanupReason {
  readonly problem: string;
  readonly consequence: string;
}

export const cleanupReasons: readonly CleanupReason[] = [
  {
    problem: "A previous render remains mounted",
    consequence: "Later tests can observe stale DOM",
  },
  {
    problem: "Component resources remain active",
    consequence: "Tests can leak subscriptions or other side effects",
  },
];

// Test isolation depends on rendered trees not leaking into subsequent tests.

// ---------------------------------------------------------------------
// 30. Automatic cleanup
// ---------------------------------------------------------------------

// In common test environments, cleanup is registered automatically.
//
// The important principle is:
//
// Each test should start with an isolated rendered environment.
//
// The exact cleanup configuration depends on the test runner and
// Testing Library setup.

// ---------------------------------------------------------------------
// 31. Render options
// ---------------------------------------------------------------------

// `render` accepts an optional second argument:
//
// render(<Component />, {
//     ...options,
// })
//
// The options object can customize how the component is mounted
// and how the resulting test environment behaves.

export type ExampleRenderOptions = RenderOptions;

// ---------------------------------------------------------------------
// 32. container option
// ---------------------------------------------------------------------

// The `container` option supplies the DOM element into which React
// Testing Library mounts the component.
//
// This is useful when the HTML structure requires a specific parent,
// such as testing a component that must be mounted inside a `<table>`.

export interface ContainerOptionExample {
  readonly element: string;
  readonly reason: string;
}

export const containerOptionExample: ContainerOptionExample = {
  element: "table",
  reason: "A table body cannot be correctly mounted under an arbitrary div",
};

// ---------------------------------------------------------------------
// 33. Custom container
// ---------------------------------------------------------------------

export const createTableContainer = (): HTMLTableElement => {
  return document.createElement("table");
};

// The DOM element is created inside a function so importing this module
// does not require a browser environment at module initialization time.

// Conceptually:
//
// const table = document.createElement("table")
//
// render(
//     <tbody>
//         <tr>
//             <td>Example</td>
//         </tr>
//     </tbody>,
//     {
//         container: table,
//     },
// )

// ---------------------------------------------------------------------
// 34. baseElement option
// ---------------------------------------------------------------------

// The `baseElement` option changes the broader DOM node used by the
// render result.
//
// It can be useful when the rendered environment has a custom root
// outside the default document body.

// ---------------------------------------------------------------------
// 35. wrapper option
// ---------------------------------------------------------------------

// The `wrapper` option supplies a React component that surrounds the
// element being rendered.
//
// This is useful for components that require shared providers such as:
//
// - context providers
// - theme providers
// - router providers
// - state providers

export interface WrapperProps {
  readonly children?: ReactNode;
}

export const TestWrapper: FC<WrapperProps> = ({ children }): ReactElement => {
  return <div data-test-wrapper="true">{children}</div>;
};

// A wrapper is rendered around the component under test.

// ---------------------------------------------------------------------
// 36. wrapper concept
// ---------------------------------------------------------------------

export interface WrapperScenario {
  readonly component: string;
  readonly wrapper: string;
  readonly purpose: string;
}

export const wrapperScenario: WrapperScenario = {
  component: "UserProfile",
  wrapper: "Required application providers",
  purpose: "Supply the environment the component expects",
};

// The wrapper should represent meaningful application infrastructure,
// not hide behavior that the test should explicitly control.

// ---------------------------------------------------------------------
// 37. Custom render
// ---------------------------------------------------------------------

// Applications often have components that require the same providers
// in many tests.
//
// A custom render utility can centralize that repeated infrastructure.
//
// Conceptually:
//
// const customRender = (
//     ui: ReactElement,
//     options?: Omit<RenderOptions, "wrapper">,
// ) => {
//     return render(ui, {
//         wrapper: TestWrapper,
//         ...options,
//     })
// }

// The custom render utility can then be used instead of the raw render function.

// ---------------------------------------------------------------------
// 38. Why custom render exists
// ---------------------------------------------------------------------

export interface CustomRenderPurpose {
  readonly problem: string;
  readonly solution: string;
}

export const customRenderPurpose: CustomRenderPurpose = {
  problem: "Many components require the same providers",
  solution: "Centralize the common provider setup in a custom render utility",
};

// Testing Library documents this pattern for reusable providers and
// application-specific rendering infrastructure. :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 39. Custom render should not hide behavior
// ---------------------------------------------------------------------

// A custom render should generally hide repetitive infrastructure,
// not behavior-specific setup.
//
// Good:
//
// render(<UserProfile />, {
//     wrapper: TestProviders,
// })
//
// Less useful:
//
// renderWithEverythingIncludingTheScenario(...)
//
// The test should still make the important scenario visible.

// ---------------------------------------------------------------------
// 40. reactStrictMode option
// ---------------------------------------------------------------------

// Current React Testing Library supports a `reactStrictMode` render option.
//
// When enabled, the rendered element is wrapped with React Strict Mode.
//
// This can be useful when a test intentionally needs to exercise
// Strict Mode behavior.

export interface StrictModeOption {
  readonly option: string;
  readonly behavior: string;
}

export const strictModeOption: StrictModeOption = {
  option: "reactStrictMode",
  behavior: "Render the test tree inside React Strict Mode",
};

// The option is currently documented by React Testing Library. :contentReference[oaicite:4]{index=4}

// ---------------------------------------------------------------------
// 41. onCaughtError
// ---------------------------------------------------------------------

// Current React Testing Library exposes `onCaughtError` as a render option.
// It receives errors caught by a React Error Boundary during rendering.

export interface RenderErrorOption {
  readonly option: string;
  readonly purpose: string;
}

export const renderErrorOptions: readonly RenderErrorOption[] = [
  {
    option: "onCaughtError",
    purpose: "Observe errors caught by an Error Boundary",
  },
  {
    option: "onRecoverableError",
    purpose: "Observe errors React automatically recovers from",
  },
];

// These options correspond to current React DOM client rendering behavior. :contentReference[oaicite:5]{index=5}

// ---------------------------------------------------------------------
// 42. hydrate option
// ---------------------------------------------------------------------

// The `hydrate` option exists for tests involving server-rendered markup
// that should be hydrated rather than initially mounted.
//
// It is not needed for ordinary component rendering.
//
// A hydration test should have an actual server-rendered DOM environment
// to hydrate rather than enabling the option without a hydration scenario.

export interface HydrationOption {
  readonly option: string;
  readonly purpose: string;
}

export const hydrationOption: HydrationOption = {
  option: "hydrate",
  purpose: "Hydrate existing server-rendered markup in a test",
};

// ---------------------------------------------------------------------
// 43. legacyRoot
// ---------------------------------------------------------------------

// `legacyRoot` is a compatibility option for applications using
// React 18 or earlier that require the legacy ReactDOM.render behavior.
//
// It is not appropriate as a default option for current React applications.

export interface LegacyRootOption {
  readonly option: string;
  readonly purpose: string;
}

export const legacyRootOption: LegacyRootOption = {
  option: "legacyRoot",
  purpose: "Support legacy ReactDOM rendering behavior in React 18 and earlier",
};

// Current Testing Library documentation marks this option as available
// only with React 18 and earlier. :contentReference[oaicite:6]{index=6}

// ---------------------------------------------------------------------
// 44. queries option
// ---------------------------------------------------------------------

// The `queries` option can replace or extend the query set available
// from the render result.
//
// This is an advanced feature for applications that need custom queries.

export interface QueriesOption {
  readonly purpose: string;
  readonly useCase: string;
}

export const queriesOption: QueriesOption = {
  purpose: "Customize the queries bound to the rendered base",
  useCase: "Add domain-specific or specialized DOM queries",
};

// Most tests should use the standard Testing Library queries.

// ---------------------------------------------------------------------
// 45. Render options should be deliberate
// ---------------------------------------------------------------------

export interface RenderOptionGuideline {
  readonly guideline: string;
}

export const renderOptionGuidelines: readonly RenderOptionGuideline[] = [
  {
    guideline: "Use the default render behavior when no special environment is required",
  },
  {
    guideline: "Use wrapper for meaningful shared providers",
  },
  {
    guideline: "Use container only when the DOM mounting context matters",
  },
  {
    guideline: "Use hydrate only for actual hydration scenarios",
  },
  {
    guideline: "Use specialized options only when the behavior under test requires them",
  },
];

// Additional options increase the complexity of the test environment,
// so they should have a clear testing purpose.

// ---------------------------------------------------------------------
// 46. Rendering providers
// ---------------------------------------------------------------------

export interface ProviderExampleProps {
  readonly children?: ReactNode;
}

export const ProviderExample: FC<ProviderExampleProps> = ({ children }): ReactElement => {
  return <section>{children}</section>;
};

// In a real application, this wrapper could contain context or other
// providers required by the component under test.

// ---------------------------------------------------------------------
// 47. Rendering children
// ---------------------------------------------------------------------

export const RenderedContent: FC = (): ReactElement => {
  return (
    <article>
      <h2>Example content</h2>
      <p>The content is rendered inside the test DOM.</p>
    </article>
  );
};

// render(<RenderedContent />)
//
// The component becomes part of the DOM available to Testing Library queries.

// ---------------------------------------------------------------------
// 48. Rendered DOM is the testing surface
// ---------------------------------------------------------------------

export interface TestingSurface {
  readonly layer: string;
  readonly purpose: string;
}

export const testingSurface: readonly TestingSurface[] = [
  {
    layer: "React component",
    purpose: "Implementation being exercised",
  },
  {
    layer: "Rendered DOM",
    purpose: "Observable interface used by the test",
  },
  {
    layer: "Testing Library queries",
    purpose: "Find elements through meaningful semantics",
  },
  {
    layer: "Assertions",
    purpose: "Verify expected behavior",
  },
];

// React Testing Library intentionally encourages tests to interact with
// the DOM rather than component instances. :contentReference[oaicite:7]{index=7}

// ---------------------------------------------------------------------
// 49. Render and user behavior
// ---------------------------------------------------------------------

export interface RenderBehaviorFlow {
  readonly phase: string;
  readonly operation: string;
}

export const renderBehaviorFlow: readonly RenderBehaviorFlow[] = [
  {
    phase: "Arrange",
    operation: "render(<Component />)",
  },
  {
    phase: "Act",
    operation: "Perform a user interaction",
  },
  {
    phase: "Assert",
    operation: "Query and verify the resulting UI",
  },
];

// `render` establishes the environment; it is not the entire test.

// ---------------------------------------------------------------------
// 50. Render and state
// ---------------------------------------------------------------------

export interface CounterProps {
  readonly initialValue: number;
}

export const Counter: FC<CounterProps> = ({ initialValue }): ReactElement => {
  return (
    <section>
      <p>Count: {initialValue}</p>
      <button type="button">Increase</button>
    </section>
  );
};

// Rendering establishes the initial UI.
// Interaction and state updates belong to the Act phase of the test.

// ---------------------------------------------------------------------
// 51. Render and props
// ---------------------------------------------------------------------

export const renderPropsExample = (): RenderResult => {
  return render(<Greeting name="John Doe" />);
};

// Props passed to render become the component's initial inputs.

// ---------------------------------------------------------------------
// 52. Render and rerender
// ---------------------------------------------------------------------

export interface StatusProps {
  readonly status: "idle" | "success";
}

export const Status: FC<StatusProps> = ({ status }): ReactElement => {
  return <p>{status === "idle" ? "Waiting" : "Saved"}</p>;
};

// Conceptually:
//
// const {rerender} = render(
//     <Status status="idle" />,
// )
//
// rerender(
//     <Status status="success" />,
// )
//
// The test can then verify the new visible state.

// ---------------------------------------------------------------------
// 53. Render and unmount
// ---------------------------------------------------------------------

export const MountableComponent: FC = (): ReactElement => {
  return <p>Mounted</p>;
};

// Conceptually:
//
// const {unmount} = render(<MountableComponent />)
//
// expect(screen.getByText("Mounted")).toBeInTheDocument()
//
// unmount()
//
// expect(screen.queryByText("Mounted")).not.toBeInTheDocument()

// The exact assertion depends on what cleanup behavior the test is intended to verify.

// ---------------------------------------------------------------------
// 54. Render and portals
// ---------------------------------------------------------------------

export const PortalContent: FC = (): ReactElement => {
  return <div role="dialog">Example dialog</div>;
};

// A real portal can render outside the normal `container`.
// In such cases, `baseElement` represents the broader DOM base,
// while Testing Library queries can still be used appropriately.

// ---------------------------------------------------------------------
// 55. Render and accessibility
// ---------------------------------------------------------------------

export const AccessibleForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
      <button type="submit">Save</button>
    </form>
  );
};

// Conceptually:
//
// render(<AccessibleForm />)
//
// screen.getByRole("textbox", {name: "Email"})
// screen.getByRole("button", {name: "Save"})
//
// The render function makes the semantic DOM available to these queries.

// ---------------------------------------------------------------------
// 56. Render and test IDs
// ---------------------------------------------------------------------

export const TestIdExample: FC = (): ReactElement => {
  return <div data-testid="application-root">Example</div>;
};

// A test ID can be used when no suitable semantic query exists:
//
// render(<TestIdExample />)
//
// screen.getByTestId("application-root")
//
// Test IDs are an escape hatch rather than the preferred default query.

// ---------------------------------------------------------------------
// 57. Render should happen in the test
// ---------------------------------------------------------------------

// Rendering is a test operation and should normally happen inside
// the test lifecycle:
//
// it("displays the greeting", () => {
//     render(<Greeting name="John Doe" />)
//     ...
// })
//
// Avoid calling `render` from the component being tested or from
// module initialization. Doing so mixes test infrastructure with
// application execution.

// ---------------------------------------------------------------------
// 58. Do not render during component execution
// ---------------------------------------------------------------------

export const CorrectComponent: FC = (): ReactElement => {
  return <p>Application component</p>;
};

// Incorrect conceptual pattern:
//
// const BadComponent = () => {
//     render(<AnotherComponent />)
//     return <p>...</p>
// }
//
// `render` belongs to the test environment, not the application's
// component render function.

// ---------------------------------------------------------------------
// 59. Render once when one initial state is enough
// ---------------------------------------------------------------------

export const singleRenderPrinciple = {
  principle: "Render the component once when the test only needs its initial behavior",
};

// A simple test should not rerender or remount without a behavioral reason.

// ---------------------------------------------------------------------
// 60. Use rerender for prop transitions
// ---------------------------------------------------------------------

export const rerenderPrinciple = {
  principle: "Use rerender when the behavior under test is a response to changed props",
};

// This keeps the test focused on the prop transition rather than creating
// multiple independent render environments.

// ---------------------------------------------------------------------
// 61. Use unmount for lifecycle behavior
// ---------------------------------------------------------------------

export const unmountPrinciple = {
  principle: "Use unmount when removal of the component is part of the behavior under test",
};

// Otherwise, normal test cleanup generally handles unmounting.

// ---------------------------------------------------------------------
// 62. Use custom containers only when needed
// ---------------------------------------------------------------------

export const containerPrinciple = {
  principle: "Use a custom container when the DOM mounting context itself matters",
};

// Ordinary components should normally use Testing Library's default container.

// ---------------------------------------------------------------------
// 63. RenderResult as a test environment
// ---------------------------------------------------------------------

export interface RenderEnvironment {
  readonly environment: string;
  readonly responsibility: string;
}

export const renderEnvironment: readonly RenderEnvironment[] = [
  {
    environment: "Rendered React tree",
    responsibility: "Provides the UI being tested",
  },
  {
    environment: "DOM container",
    responsibility: "Hosts the rendered tree",
  },
  {
    environment: "Bound queries",
    responsibility: "Locate observable elements",
  },
  {
    environment: "Lifecycle utilities",
    responsibility: "Control rerendering and unmounting",
  },
];

// ---------------------------------------------------------------------
// 64. Complete conceptual test
// ---------------------------------------------------------------------

// A complete test using `render` follows this shape:
//
// it("displays a user's name", () => {
//     // Arrange
//     render(<Greeting name="John Doe" />)
//
//     // Assert
//     expect(
//         screen.getByRole("heading", {
//             name: "Hello, John Doe",
//         }),
//     ).toBeInTheDocument()
// })
//
// There is no Act phase because the behavior being tested is the
// initial rendered output.

// ---------------------------------------------------------------------
// 65. Complete interaction test
// ---------------------------------------------------------------------

// A component with interaction would follow:
//
// it("updates the visible state after an interaction", async () => {
//     // Arrange
//     render(<InteractiveComponent />)
//
//     // Act
//     await user.click(
//         screen.getByRole("button", {name: "Save"}),
//     )
//
//     // Assert
//     expect(
//         screen.getByText("Saved"),
//     ).toBeInTheDocument()
// })
//
// The important structure is:
//
// render -> interact -> observe

// ---------------------------------------------------------------------
// 66. Render API checklist
// ---------------------------------------------------------------------

export interface RenderChecklist {
  readonly item: string;
}

export const renderChecklist: readonly RenderChecklist[] = [
  {
    item: "Render the React element inside the test",
  },
  {
    item: "Use the rendered DOM as the primary testing surface",
  },
  {
    item: "Prefer semantic Testing Library queries",
  },
  {
    item: "Use screen when querying the document is clearer",
  },
  {
    item: "Use container only when direct container access is necessary",
  },
  {
    item: "Use rerender for meaningful prop transitions",
  },
  {
    item: "Use unmount when testing removal or cleanup behavior",
  },
  {
    item: "Use wrapper for required shared providers",
  },
  {
    item: "Use custom containers only when the mounting context matters",
  },
  {
    item: "Allow normal test cleanup to isolate rendered trees",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `render` mounts a React element into a DOM environment for testing.
// - Rendering normally belongs to the Arrange phase of a test.
// - `render` establishes the test environment but does not perform assertions.
// - The returned RenderResult provides queries and utilities for managing the rendered tree.
// - `screen` is often preferred for querying the document because it keeps query usage clear.
// - `container` is the DOM node into which the React tree is mounted.
// - Direct `container.querySelector` usage should generally be avoided when a meaningful Testing Library query exists.
// - `baseElement` represents the broader DOM base used by the render result and is useful for scenarios such as portals.
// - `debug` can inspect the rendered DOM, while `screen.debug()` is generally the preferred debugging form.
// - `rerender` updates the existing render with a new React element and is useful for testing meaningful prop changes.
// - `rerender` updates an existing render rather than creating a separate render tree.
// - `unmount` removes the rendered React tree and is useful when component removal or cleanup behavior is being tested.
// - `asFragment` captures the current rendered DOM as a DocumentFragment and can be useful for comparing rendered states.
// - `cleanup` unmounts rendered React trees and normally runs automatically in common test environments with suitable lifecycle hooks.
// - The `wrapper` option supplies shared providers or other meaningful rendering infrastructure.
// - Custom render utilities can centralize repeated provider setup without hiding behavior-specific test setup.
// - The `container` option is useful when the component requires a specific DOM mounting context.
// - The `hydrate` option is intended for tests involving existing server-rendered markup.
// - `legacyRoot` is a compatibility option for React 18 and earlier and is not a default choice for current React applications.
// - `reactStrictMode`, `onCaughtError`, and `onRecoverableError` provide specialized control over current React rendering behavior.
// - The rendered DOM is the primary testing surface in React Testing Library rather than component instances or internal implementation details.
// - `render` should be called by the test environment, not from inside application components or at module initialization.
// - A simple render test may have no Act phase when the behavior under test is the initial rendered output.
