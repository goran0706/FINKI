/**
 * Render and Commit
 * =================
 *
 * React updates the UI through distinct render and commit phases. During the
 * render phase, React calls component functions and calculates the React
 * element tree produced by their current props and state.
 *
 * Rendering is a calculation step. React evaluates the component functions and
 * calculates the React elements produced by their returned JSX. It does not
 * create, update, or remove DOM nodes during this calculation, so render-phase
 * code must remain free of side effects such as manually modifying the DOM.
 *
 * After rendering, React performs reconciliation by comparing the newly
 * calculated React element tree with the previous tree. Reconciliation
 * determines what changed, what can be preserved, and what needs to be added,
 * updated, or removed.
 *
 * During the commit phase, React applies the required changes to the actual
 * browser DOM. This is when DOM nodes are created, updated, or removed. React
 * also attaches refs during the commit so that refs can point to the committed
 * DOM nodes.
 *
 * Effects run after the commit. This makes effects appropriate for synchronizing
 * with the committed DOM or with external systems. A DOM ref for an element
 * being created is therefore not available during the render that produces
 * that element; the DOM node must first be committed.
 *
 * A state update schedules rendering; it does not directly mutate the DOM.
 * React may render without producing a corresponding DOM mutation when the
 * resulting UI does not require a change to the committed DOM.
 *
 * Rendering can also be interrupted or repeated in modern React. Component
 * rendering must therefore remain free of side effects because React may
 * perform rendering work without committing that particular render result.
 *
 * The distinction can be summarized as:
 *
 * Render    = calculate the React element tree.
 * Reconcile = compare the new tree with the previous tree.
 * Commit    = apply the required changes to the actual DOM.
 * Effects   = run after the commit to synchronize with the committed UI or external systems.
 */

import { type FC, type ReactElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RenderPhaseProps {
  readonly initialValue: number;
}

export interface CommitPhaseProps {
  readonly initialText: string;
}

export interface RefAfterCommitProps {
  readonly label: string;
}

export interface EffectAfterCommitProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const RenderPhaseExample: FC<RenderPhaseProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<number>(initialValue);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <p>Render-phase value: {value}</p>
      <button type="button" onClick={increment}>
        Schedule state update
      </button>
    </section>
  );
};

export const CommitPhaseExample: FC<CommitPhaseProps> = ({ initialText }): ReactElement => {
  const [text, setText] = useState<string>(initialText);

  const updateText = (): void => {
    setText((previousText: string): string => `${previousText}!`);
  };

  return (
    <section>
      <p>{text}</p>
      <button type="button" onClick={updateText}>
        Update committed output
      </button>
    </section>
  );
};

export const RefAfterCommit: FC<RefAfterCommitProps> = ({ label }): ReactElement => {
  const [hasInput, setHasInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect((): void => {
    setHasInput(inputRef.current !== null);
  }, []);

  return (
    <section>
      <label htmlFor="commit-phase-input">{label}</label>
      <input id="commit-phase-input" ref={inputRef} defaultValue="John Doe" />
      <p>{hasInput ? "The input ref is attached after commit." : "The input ref has not been observed yet."}</p>
    </section>
  );
};

export const EffectAfterCommit: FC<EffectAfterCommitProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);
  const [committedCount, setCommittedCount] = useState<number>(initialCount);

  useEffect((): void => {
    setCommittedCount(count);
  }, [count]);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Current rendered count: {count}</p>
      <p>Effect-observed count: {committedCount}</p>

      <button type="button" onClick={increment}>
        Increment count
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RenderAndCommitExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Rendering calculates output after a state update</h2>
      <RenderPhaseExample initialValue={0} />

      <h2>2. Committing applies the calculated output</h2>
      <CommitPhaseExample initialText="John Doe" />

      <h2>3. DOM refs become attached after commit</h2>
      <RefAfterCommit label="Committed input" />

      <h2>4. Effects run after the component has committed</h2>
      <EffectAfterCommit initialCount={0} />
    </main>
  );
};

export default RenderAndCommitExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The render phase calculates the React element tree for current inputs.
// - The commit phase applies the required changes to the host environment.
// - State setters schedule updates rather than directly changing the DOM.
// - Render-phase code should remain free of side effects because React may
//   render more than once or discard rendered work before committing it.
// - DOM refs become attached as part of committing the corresponding element.
// - Effects run after commit and can synchronize with committed DOM state or
//   external systems.
// - Rendering and committing are separate stages of React's update process.
// - A render does not guarantee that React must make a visible DOM change.
