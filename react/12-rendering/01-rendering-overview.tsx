/**
 * Rendering Overview
 * ==================
 *
 * React rendering is the process of calling a component to calculate the React
 * elements that describe the UI for the current props and state. A component
 * returns JSX, which produces React elements represented as JavaScript objects.
 *
 * These React elements form a React element tree. The tree is a description of
 * the UI, not the actual browser DOM. Its elements are not DOM nodes; they
 * describe the elements that React should render.
 *
 * For example, JSX such as:
 *
 * <main>
 *   <h1>Hello</h1>
 *   <button>Click me</button>
 * </main>
 *
 * produces React elements that form a tree with this structure:
 *
 * main
 * ├── h1
 * └── button
 *
 * The `main`, `h1`, and `button` in this tree represent React element objects.
 * They are not HTML elements, DOM nodes, or Shadow DOM nodes.
 *
 * Rendering does not mean that React creates or updates DOM nodes. Rendering is
 * the calculation step in which React evaluates component functions and
 * calculates the React element tree produced by their returned JSX.
 *
 * React then performs reconciliation by comparing the newly calculated React
 * element tree with the previous React element tree. Reconciliation determines
 * which elements correspond to each other, which elements can be preserved,
 * and which parts of the UI need to change.
 *
 * When element types and keys identify corresponding elements, React can preserve
 * existing component instances and DOM nodes while updating only the parts whose
 * rendered output changed.
 *
 * State updates schedule rendering, but rendering and committing are distinct
 * phases. During rendering, component functions are evaluated and their React
 * element output is calculated. During the commit phase, React applies the
 * necessary changes to the actual DOM.
 *
 * A state setter therefore does not directly change the DOM. The setter schedules
 * an update; React subsequently renders the affected component, calculates its
 * new React element tree, reconciles it with the previous tree, and commits the
 * resulting changes to the DOM.
 *
 * A render can occur even when the resulting DOM change is small or absent,
 * because rendering is the calculation of React elements rather than a DOM
 * mutation.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StaticRenderingProps {
  readonly message: string;
}

export interface StateRenderingProps {
  readonly initialCount: number;
}

export interface ConditionalRenderingProps {
  readonly initialVisible: boolean;
}

export interface StableElementRenderingProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StaticRendering: FC<StaticRenderingProps> = ({ message }): ReactElement => {
  return (
    <section>
      <p>{message}</p>
    </section>
  );
};

export const StateRendering: FC<StateRenderingProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

export const ConditionalRendering: FC<ConditionalRenderingProps> = ({ initialVisible }): ReactElement => {
  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);

  const toggleVisibility = (): void => {
    setIsVisible((previousVisible: boolean): boolean => !previousVisible);
  };

  return (
    <section>
      <button type="button" onClick={toggleVisibility}>
        {isVisible ? "Hide message" : "Show message"}
      </button>

      {isVisible ? <p>The conditional content is rendered.</p> : null}
    </section>
  );
};

export const StableElementRendering: FC<StableElementRenderingProps> = ({ label }): ReactElement => {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <label htmlFor="rendering-overview-input">{label}</label>
      <input id="rendering-overview-input" defaultValue="John Doe" />
      <p>Render-triggering count: {count}</p>

      <button type="button" onClick={increment}>
        Render again
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RenderingOverviewExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Rendering a component's element output</h2>
      <StaticRendering message="This content comes from the component render." />

      <h2>2. Rendering again after a state update</h2>
      <StateRendering initialCount={0} />

      <h2>3. Rendering different output from conditional state</h2>
      <ConditionalRendering initialVisible={true} />

      <h2>4. Rendering does not mean recreating every DOM node</h2>
      <StableElementRendering label="Name" />
    </main>
  );
};

export default RenderingOverviewExamples;

// ---------------------------------------------------------------------
// Update Flow
// ---------------------------------------------------------------------
// State or props change
//       ↓
// React schedules an update
//       ↓
// React calls the component function
//       ↓
// The component evaluates its current props and state
//       ↓
// The component returns JSX
//       ↓
// JSX produces React element objects
//       ↓
// React calculates the new React element tree
//       ↓
// React reconciles the new tree with the previous tree
//       ↓
// React determines which existing elements and DOM nodes can be preserved
//       ↓
// React determines which parts need to be added, updated, or removed
//       ↓
// React commits the required changes
//       ↓
// The actual browser DOM is updated

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State and prop changes schedule updates; they do not directly mutate the DOM.
// - Rendering evaluates component functions with their current props and state
//   and calculates the React element tree produced by their returned JSX.
// - React elements are JavaScript objects that describe the UI; they are not
//   actual DOM nodes.
// - The React element tree is a description of the UI and is separate from the
//   actual browser DOM.
// - Reconciliation compares the new React element tree with the previous tree
//   to determine what changed and what can be preserved.
// - Compatible elements can allow React to preserve existing component instances
//   and DOM nodes rather than recreating them.
// - Conditional rendering changes the React element tree according to the
//   component's current props and state.
// - The commit phase applies the changes determined by reconciliation to the
//   actual browser DOM.
// - Rendering is a calculation step, so a render can occur without producing a
//   corresponding DOM mutation.
// - Rendering, reconciliation, and committing are distinct parts of React's
//   process for updating the UI.
