/**
 * Refs and Rendering
 * ==================
 *
 * React renders a component when its state changes, its parent renders with
 * changed inputs, or another update causes React to reconcile that component.
 * A ref does not participate in this scheduling mechanism. `useRef` returns a
 * stable object whose `.current` property can be mutated without scheduling
 * another render.
 *
 * Because ref mutations do not render the component, JSX reads of `.current`
 * only reflect the value that existed during the render that produced that
 * JSX. Mutating a ref from an event handler changes the stored value, but the
 * already-mounted DOM does not automatically change. A later render can read
 * the updated ref value and produce different output.
 *
 * Refs can therefore store render-independent mutable data, while state should
 * represent data that the UI must react to. A useful pattern is to combine
 * both: store an imperative resource in a ref and store the resource's visible
 * status in state.
 *
 * A ref also survives ordinary re-renders because React preserves the ref
 * object for the lifetime of the mounted component. Unmounting the component
 * discards that ref, so a ref is not persistent storage outside the component
 * instance.
 */

import { type FC, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RefRenderSnapshotProps {
  readonly initialValue: number;
}

export interface StateRenderSnapshotProps {
  readonly initialValue: number;
}

export interface RenderCountRefProps {
  readonly label: string;
}

export interface ImperativeResourceProps {
  readonly durationMs: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const RefRenderSnapshot: FC<RefRenderSnapshotProps> = ({ initialValue }): JSX.Element => {
  const valueRef = useRef<number>(initialValue);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const mutateRef = (): void => {
    valueRef.current += 1;
  };

  const triggerRender = (): void => {
    setRenderVersion((prev: number): number => prev + 1);
  };

  return (
    <div>
      <p>Ref value in the current render: {valueRef.current}</p>
      <p>Render version: {renderVersion}</p>

      <button type="button" onClick={mutateRef}>
        Mutate ref
      </button>

      <button type="button" onClick={triggerRender}>
        Trigger render
      </button>
    </div>
  );
};

export const StateRenderSnapshot: FC<StateRenderSnapshotProps> = ({ initialValue }): JSX.Element => {
  const [value, setValue] = useState<number>(initialValue);

  const incrementState = (): void => {
    setValue((prev: number): number => prev + 1);
  };

  return (
    <div>
      <p>State value in the current render: {value}</p>

      <button type="button" onClick={incrementState}>
        Increment state
      </button>
    </div>
  );
};

export const RenderCountRef: FC<RenderCountRefProps> = ({ label }): JSX.Element => {
  const renderCountRef = useRef<number>(0);

  renderCountRef.current += 1;

  return (
    <div>
      <p>{label}</p>
      <p>Observed render count: {renderCountRef.current}</p>
    </div>
  );
};

export const ImperativeResource: FC<ImperativeResourceProps> = ({ durationMs }): JSX.Element => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const start = (): void => {
    if (timerRef.current !== null) {
      return;
    }

    timerRef.current = setTimeout((): void => {
      timerRef.current = null;
      setIsRunning(false);
    }, durationMs);

    setIsRunning(true);
  };

  const stop = (): void => {
    if (timerRef.current === null) {
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
  };

  useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>{isRunning ? "Timer is running." : "Timer is stopped."}</p>

      <button type="button" onClick={start}>
        Start timer
      </button>

      <button type="button" onClick={stop}>
        Stop timer
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RefsAndRenderingExamples: FC = (): JSX.Element => {
  return (
    <main>
      <h2>1. Ref mutations do not trigger rendering</h2>
      <RefRenderSnapshot initialValue={0} />

      <h2>2. State changes trigger rendering</h2>
      <StateRenderSnapshot initialValue={0} />

      <h2>3. A ref can observe renders without causing them</h2>
      <RenderCountRef label="This render count is stored in a ref." />

      <h2>4. Refs can hold imperative resources while state drives UI</h2>
      <ImperativeResource durationMs={3000} />
    </main>
  );
};

export default RefsAndRenderingExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Mutating `.current` does not schedule a React render.
// - JSX that reads a ref reflects the ref value from the render that produced
//   that JSX.
// - A later render can observe a ref mutation and produce updated JSX.
// - State is the appropriate mechanism when a value must automatically update
//   rendered output.
// - A ref object remains stable across renders of the mounted component.
// - Refs can store imperative resources while state represents their visible
//   status.
// - Unmounting a component discards its refs because refs belong to that
//   component instance.
// - Ref mutations should not be used as a substitute for state when the UI
//   needs to react immediately to the changed value.
