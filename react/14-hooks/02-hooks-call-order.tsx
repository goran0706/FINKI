/**
 * Hook Call Order
 * ===============
 *
 * React associates each Hook invocation with a position in a component's
 * internal Hook sequence. The association is positional rather than based on
 * the local variable names used to receive returned values. During a render,
 * React encounters Hook calls in source execution order and retrieves the
 * state, effect, ref, or other Hook data associated with each position.
 *
 * For example, if the first Hook is `useState` and the second Hook is
 * `useState`, React treats those invocations as position 1 and position 2.
 * On the next render, the first and second Hook calls must still occur in that
 * same order. Changing the order can cause React to associate existing Hook
 * data with the wrong invocation or report a Hook-order error in development.
 *
 * Conditional branches, loops, and early returns can change the number or
 * ordering of executed Hook calls. The safe pattern is to keep Hook calls
 * unconditional and move conditional behavior inside the Hook's callback or
 * into values used by the Hook.
 *
 * Hook call order is local to each component or custom Hook invocation.
 * Rendering a child component conditionally does not reorder the parent's
 * Hooks because the child owns a separate Hook sequence.
 */

import { type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StableHookOrderProps {
  readonly initialName: string;
  readonly initialCount: number;
}

export interface ConditionalBehaviorProps {
  readonly enabled: boolean;
}

export interface ChildComponentIsolationProps {
  readonly showChild: boolean;
}

export interface ChildHookSequenceProps {
  readonly initialValue: number;
}

export interface HookOrderDemoProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates multiple Hooks whose relative execution order stays stable.
 * React can therefore associate the first state slot with `name` and the
 * second state slot with `count` on every render.
 */
export const StableHookOrderExample: FC<StableHookOrderProps> = ({
  initialName,
  initialCount,
}: StableHookOrderProps): ReactNode => {
  const [name, setName] = useState<string>(initialName);
  const [count, setCount] = useState<number>(initialCount);

  const updateName = (): void => {
    setName("John Doe");
  };

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>Stable Hook order</h3>
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={updateName}>
        Set example name
      </button>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * Demonstrates that conditional behavior can change what an effect does
 * without changing the position of the `useEffect` call itself.
 */
export const ConditionalBehaviorWithoutReordering: FC<ConditionalBehaviorProps> = ({
  enabled,
}: ConditionalBehaviorProps): ReactNode => {
  const [status, setStatus] = useState<string>("Inactive");

  useEffect((): void | (() => void) => {
    if (!enabled) {
      setStatus("Inactive");
      return;
    }

    setStatus("Active");

    return (): void => {
      setStatus("Inactive");
    };
  }, [enabled]);

  return (
    <section>
      <h3>Conditional behavior without reordering</h3>
      <p>Status: {status}</p>
    </section>
  );
};

/**
 * Demonstrates component isolation. The parent's Hook sequence is unchanged
 * when the child is mounted or unmounted because the child's Hooks belong to
 * the child's own component instance.
 */
export const ChildComponentIsolation: FC<ChildComponentIsolationProps> = ({
  showChild,
}: ChildComponentIsolationProps): ReactNode => {
  const [parentCount, setParentCount] = useState<number>(0);

  const incrementParent = (): void => {
    setParentCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>Separate component Hook sequences</h3>
      <p>Parent count: {parentCount}</p>
      <button type="button" onClick={incrementParent}>
        Increment parent
      </button>

      {showChild ? <ChildHookSequence initialValue={10} /> : null}
    </section>
  );
};

/**
 * Owns an independent Hook sequence. Its state belongs to this component
 * rather than to the component that conditionally renders it.
 */
export const ChildHookSequence: FC<ChildHookSequenceProps> = ({ initialValue }: ChildHookSequenceProps): ReactNode => {
  const [value, setValue] = useState<number>(initialValue);

  const increment = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <div>
      <p>Child value: {value}</p>
      <button type="button" onClick={increment}>
        Increment child
      </button>
    </div>
  );
};

/**
 * Shows an invalid Hook-order pattern as text rather than executing it.
 * Executing a conditionally skipped Hook would make the component's Hook
 * sequence differ between renders.
 */
export const InvalidHookOrderExample: FC = (): ReactNode => {
  const invalidExample: string = `
// Invalid: the second Hook does not execute on every render.
const [first, setFirst] = useState(0);

if (someCondition) {
  const [second, setSecond] = useState(0);
}
`;

  return (
    <section>
      <h3>Invalid Hook-order pattern</h3>
      <pre>{invalidExample}</pre>
    </section>
  );
};

/**
 * Demonstrates that local variable names do not determine Hook identity.
 * The important property is that each Hook invocation occupies a stable
 * position in the component's execution sequence.
 */
export const HookIdentityIsPositional: FC = (): ReactNode => {
  const [firstValue, setFirstValue] = useState<number>(1);
  const [secondValue, setSecondValue] = useState<number>(2);

  const swapValues = (): void => {
    setFirstValue((previousValue: number): number => previousValue + 10);
    setSecondValue((previousValue: number): number => previousValue + 10);
  };

  return (
    <section>
      <h3>Hook identity is positional</h3>
      <p>First state position: {firstValue}</p>
      <p>Second state position: {secondValue}</p>
      <button type="button" onClick={swapValues}>
        Update both positions
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HooksCallOrderContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Hook Call Order</h1>

      <h2>1. Maintaining a stable Hook sequence</h2>
      <StableHookOrderExample initialName="John Doe" initialCount={0} />

      <h2>2. Changing behavior without changing Hook order</h2>
      <ConditionalBehaviorWithoutReordering enabled={true} />

      <h2>3. Keeping child Hooks isolated from parent Hooks</h2>
      <ChildComponentIsolation showChild={true} />

      <h2>4. Recognizing an invalid Hook-order pattern</h2>
      <InvalidHookOrderExample />

      <h2>5. Understanding positional Hook identity</h2>
      <HookIdentityIsPositional />
    </main>
  );
};

export default HooksCallOrderContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React associates Hook data with the order in which Hooks execute.
// - Hook calls must execute in the same order on every render.
// - Conditional behavior should not conditionally execute the Hook itself.
// - A child component has its own independent Hook sequence.
// - Conditional mounting of a child does not reorder the parent's Hooks.
// - Local variable names do not determine a Hook's internal position.
// - Changing Hook order can associate data incorrectly or produce a Hook-order error.
