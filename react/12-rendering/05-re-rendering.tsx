/**
 * Re-rendering
 * ============
 *
 * A re-render occurs when React evaluates a component again to calculate its
 * next rendered output. Common causes include a state update in the component,
 * a parent component rendering again, a changed prop, a changed context value,
 * or an update from an external store that the component subscribes to.
 *
 * A state update causes the component that owns the state to render again.
 * The update can come from an event handler, an effect, or another function
 * that calls the component's state setter. Calling the setter schedules an
 * update; React then evaluates the component again using the new state.
 *
 * A parent re-render normally causes its child components to be evaluated
 * again as React calculates the parent's new React element output. This can
 * happen even when the child's props have not changed. `React.memo` can allow
 * React to skip a child render when its props are considered equal, but it does
 * not prevent the child from rendering when its own state or consumed context
 * requires an update.
 *
 * A prop change can cause a component to re-render when its parent provides
 * different prop values. This includes newly created objects, arrays, and
 * functions. Two objects or arrays can contain identical values while still
 * being different references, and a function created during a parent render is
 * also a new reference. These new references can therefore make a prop appear
 * changed even when its contents or behavior are effectively the same.
 *
 * A changed context value can cause components that consume that context to
 * re-render. The component does not need to receive the context value as a
 * direct prop; a component using `useContext` is subscribed to the context
 * value it consumes.
 *
 * An external store can also cause a component to re-render when the component
 * subscribes to that store and its subscribed snapshot changes. This commonly
 * occurs with state-management libraries or React's `useSyncExternalStore`.
 *
 * In development, `StrictMode` can intentionally invoke rendering-related code
 * more than once to help expose accidental side effects and other problems.
 * Therefore, an apparent duplicate render during development is not necessarily
 * caused by a state, prop, or context change.
 *
 * When investigating why a component re-rendered, check its own state updates,
 * its parent renders, its props and their references, consumed context values,
 * external store subscriptions, and development-only `StrictMode` behavior.
 *
 * A re-render does not necessarily mean that the browser DOM will be changed.
 * React calculates the component's new React element output, reconciles it with
 * the previous output, and commits only the required DOM changes.
 *
 * Re-rendering is therefore a calculation step, not a direct DOM operation.
 * Component functions should remain pure because React may evaluate them without
 * ultimately committing a visible DOM change.
 */

import { type FC, memo, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ParentRerenderProps {
  readonly childLabel: string;
}

export interface ChildStateProps {
  readonly label: string;
}

export interface MemoizedChildProps {
  readonly label: string;
}

export interface RenderCounterProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ParentRerenderChild: FC<ChildStateProps> = ({ label }): ReactElement => {
  return <p>{label}</p>;
};

export const ParentRerender: FC<ParentRerenderProps> = ({ childLabel }): ReactElement => {
  const [parentCount, setParentCount] = useState<number>(0);

  const incrementParent = (): void => {
    setParentCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Parent render-triggering state: {parentCount}</p>
      <ParentRerenderChild label={childLabel} />

      <button type="button" onClick={incrementParent}>
        Update parent
      </button>
    </section>
  );
};

export const ChildState: FC<ChildStateProps> = ({ label }): ReactElement => {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>{label}</p>
      <p>Child state: {count}</p>

      <button type="button" onClick={increment}>
        Update child
      </button>
    </section>
  );
};

export const MemoizedChild: FC<MemoizedChildProps> = memo(function MemoizedChild({
  label,
}: MemoizedChildProps): ReactElement {
  return <p>{label}</p>;
});

export const RenderCounter: FC<RenderCounterProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>State value: {count}</p>
      <p>This component re-renders when its own state is updated.</p>

      <button type="button" onClick={increment}>
        Re-render component
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RerenderingExamples: FC = (): ReactElement => {
  const [parentCount, setParentCount] = useState<number>(0);

  const incrementParent = (): void => {
    setParentCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <main>
      <h2>1. A parent update can re-render its child</h2>
      <ParentRerender childLabel="Child evaluated during parent renders." />

      <h2>2. A child can update its own state</h2>
      <ChildState label="This component owns the state it updates." />

      <h2>3. Memoization can skip a child with unchanged props</h2>
      <p>Parent state: {parentCount}</p>
      <MemoizedChild label="Stable child props" />
      <button type="button" onClick={incrementParent}>
        Update parent state
      </button>

      <h2>4. State updates trigger the owning component to render again</h2>
      <RenderCounter initialCount={0} />
    </main>
  );
};

export default RerenderingExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A re-render evaluates a component again to calculate its next output.
// - A state update can trigger the component that owns that state to render.
// - A parent re-render normally causes ordinary child components to be
//   evaluated again.
// - A child can re-render from its own state update without requiring its
//   parent to update.
// - `memo` can skip a child render when its props are considered unchanged.
// - Skipping a render does not mean the DOM is always unchanged for unrelated
//   parts of the application.
// - A re-render is not synonymous with a DOM mutation.
// - Render functions should remain pure because React may render without
//   committing a corresponding visible DOM change.
