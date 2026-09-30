/**
 * Event Handler Closures
 * ======================
 *
 * An event handler created during a component render can form a JavaScript closure over variables
 * from that render's lexical scope. This allows the handler to access props, local variables, and
 * state values without receiving those values as explicit event arguments.
 *
 * Each render creates a new lexical environment. A handler created during that render closes over
 * the values available in that environment, so the handler observes the values from the render in
 * which it was created. React replaces the rendered event handler when a later render produces a
 * new handler, which normally keeps the active handler associated with the latest render's values.
 *
 * Closures are useful for associating application-specific data with event handlers, but a closure
 * does not automatically provide the latest value in every asynchronous situation. A callback
 * retained beyond the render that created it can continue to reference the values captured by that
 * render, which is an important source of stale-closure behavior.
 */

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PropClosureProps {
  readonly userName: string;
}

export interface LocalVariableClosureProps {
  readonly userId: number;
}

export interface StateClosureProps {
  readonly initialCount: number;
}

export interface StaleClosureProps {
  readonly initialDelay: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**

 * The handler closes over the `userName` prop from the render that created
 * the handler, allowing the value to be used without an event argument.
 */
export const PropClosure: React.FC<PropClosureProps> = ({ userName }): React.ReactElement => {
  const handleClick = (): void => {
    console.log(`Selected user: ${userName}`);
  };

  return (
    <button type="button" onClick={handleClick}>
      Select {userName}
    </button>
  );
};

/**

 * A handler can close over a local variable created during rendering.
 * The value does not need to be passed through the click event.
 */
export const LocalVariableClosure: React.FC<LocalVariableClosureProps> = ({ userId }): React.ReactElement => {
  const selectedLabel: string = `User ${userId}`;

  const handleClick = (): void => {
    console.log(`Selected: ${selectedLabel}`);
  };

  return (
    <button type="button" onClick={handleClick}>
      {selectedLabel}{" "}
    </button>
  );
};

/**

 * A handler closes over the state value from its current render. The
 * functional state updater receives the latest pending state value when
 * calculating the next state.
 */
export const StateClosure: React.FC<StateClosureProps> = ({ initialCount }): React.ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const handleClick = (): void => {
    console.log(`Count from this render: ${count}`);
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={handleClick}>
        Increment
      </button>
    </div>
  );
};

/**

 * A callback retained by an asynchronous operation can continue to close
 * over values from the render in which that callback was created. The
 * timeout below captures the current count when the effect is created.
 */
export const StaleClosure: React.FC<StaleClosureProps> = ({ initialDelay }): React.ReactElement => {
  const [count, setCount] = useState<number>(0);
  const [delay, setDelay] = useState<number>(initialDelay);
  const [capturedCount, setCapturedCount] = useState<number | null>(null);

  useEffect(() => {
    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      setCapturedCount(count);
    }, delay);

    return (): void => {
      clearTimeout(timeoutId);
    };
  }, [count, delay]);

  const handleIncrement = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <div>
      <p>Current count: {count}</p> <p>Captured count: {capturedCount ?? "Waiting"}</p>
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
      <button
        type="button"
        onClick={(): void => {
          setDelay((previousDelay: number): number => (previousDelay === 1000 ? 3000 : 1000));
        }}
      >
        Delay: {delay}ms
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventHandlerClosuresDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Closing Over a Prop</h2>
      <PropClosure userName="John Doe" />

      <h2>2. Closing Over a Local Variable</h2>
      <LocalVariableClosure userId={101} />

      <h2>3. Closing Over State</h2>
      <StateClosure initialCount={0} />

      <h2>4. Asynchronous Closure and Render Values</h2>
      <StaleClosure initialDelay={1000} />
    </div>
  );
};

export default EventHandlerClosuresDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event handlers can close over props, state, and local variables from the render in which the handler was created.
// - Each render creates a new lexical environment containing that render's local values.
// - React normally attaches the event handler produced by the current render.
// - Functional state updates calculate the next state from the latest pending state value.
// - Asynchronous callbacks can retain values captured by an earlier render, producing stale-closure behavior.
// - Closures capture values from their lexical environment; they do not create a live reference that automatically changes with later renders.
