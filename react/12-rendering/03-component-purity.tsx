/**
 * Component Purity
 * ================
 *
 * A React component is pure when rendering it produces the same result for
 * the same inputs and does not mutate values outside its local render scope.
 * Its inputs are primarily props, state, and context, and rendering should
 * calculate the UI rather than perform external side effects.
 *
 * React relies on render purity because it may call components more than once,
 * restart rendering, or discard rendered work before committing it. Code that
 * mutates external state during rendering can therefore produce duplicated or
 * otherwise inconsistent results.
 *
 * Local variables created during a render are safe to calculate and mutate
 * because they belong only to that render. Mutating a prop, module-level
 * variable, DOM node, or external resource during render is different because
 * those values exist outside the component's local render calculation.
 *
 * Side effects are operations that interact with something outside the render
 * calculation, such as changing the DOM, starting a timer, making a network
 * request, subscribing to an external system, or modifying external state.
 * These operations should not run during rendering.
 *
 * Event handlers are used for side effects that should happen because of a
 * specific user interaction. For example, a click handler can submit a form,
 * update external state, or start an operation in direct response to the click.
 *
 * `useEffect` is used for side effects that need to happen after React has
 * rendered and committed the UI, typically to synchronize the component with
 * an external system. Examples include connecting to a subscription, starting
 * synchronization with an external API, or interacting with an external
 * system when specified props or state change.
 *
 * An event handler therefore represents an interaction-driven side effect,
 * while `useEffect` represents a post-render synchronization side effect.
 * Neither should be performed directly during the component's render
 * calculation.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PureGreetingProps {
  readonly name: string;
}

export interface PureCalculationProps {
  readonly firstValue: number;
  readonly secondValue: number;
}

export interface LocalMutationProps {
  readonly initialValue: number;
}

export interface EffectSideEffectProps {
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PureGreeting: FC<PureGreetingProps> = ({ name }): ReactElement => {
  const greeting: string = `Hello, ${name}.`;

  return <p>{greeting}</p>;
};

export const PureCalculation: FC<PureCalculationProps> = ({ firstValue, secondValue }): ReactElement => {
  const total: number = firstValue + secondValue;

  return <p>Total: {total}</p>;
};

export const LocalMutation: FC<LocalMutationProps> = ({ initialValue }): ReactElement => {
  const values: number[] = [initialValue];

  values.push(initialValue + 1);

  return <p>Locally calculated values: {values.join(", ")}</p>;
};

export const EffectSideEffect: FC<EffectSideEffectProps> = ({ message }): ReactElement => {
  const [effectMessage, setEffectMessage] = useState<string>("");

  useEffect((): void => {
    setEffectMessage(message);
  }, [message]);

  return (
    <section>
      <p>Rendered message: {message}</p>
      <p>Effect-synchronized message: {effectMessage}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ComponentPurityExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Pure rendering from props</h2>
      <PureGreeting name="John Doe" />

      <h2>2. Pure calculation from component inputs</h2>
      <PureCalculation firstValue={10} secondValue={20} />

      <h2>3. Mutating render-local data</h2>
      <LocalMutation initialValue={5} />

      <h2>4. Performing synchronization outside render</h2>
      <EffectSideEffect message="Example synchronization value" />
    </main>
  );
};

export default ComponentPurityExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A pure component produces the same output for the same inputs.
// - Rendering should calculate UI rather than perform external side effects.
// - React can render components more than once or discard rendered work, so
//   render-phase code must not depend on being executed exactly once.
// - Mutating render-local variables is safe because those values belong only
//   to the current render calculation.
// - Mutating props or external values during render breaks render purity.
// - DOM operations, subscriptions, timers, and other external side effects
//   belong in event handlers or appropriate effects rather than render logic.
// - Pure calculations can be performed directly during rendering.
// - An effect is an appropriate boundary when rendering must synchronize with
//   an external system after the UI has been committed.
