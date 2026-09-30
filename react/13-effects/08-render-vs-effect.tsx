/**
 * Render vs Effect
 * ================
 *
 * Rendering is React's calculation of the UI from the component's current
 * props, state, and context. Render logic should be pure: given the same
 * inputs, it should calculate the same result without causing external side
 * effects.
 *
 * An Effect runs after React commits the rendered UI and is intended to
 * synchronize that committed UI with an external system. An Effect should
 * not normally be used to calculate ordinary derived data because doing so
 * stores a calculation as additional state and requires a later render to
 * synchronize that state.
 *
 * The usual choice is to calculate values directly during rendering when they
 * can be derived from existing props or state. An Effect is the appropriate
 * choice when React must synchronize with something outside React, such as
 * the browser document, a subscription, a timer, a network connection, or
 * an imperative third-party API.
 *
 * `useMemo` can be used when a pure calculation is expensive and its inputs
 * are stable enough for memoization to provide a useful optimization. It
 * does not change the calculation into an Effect and should not be used just
 * to avoid writing an ordinary derived expression.
 *
 * Event handlers are the preferred location for work caused directly by a
 * user interaction. Effects are for synchronization caused by the component's
 * rendered state rather than for responding to a particular event.
 *
 * A useful distinction is:
 * - render when calculating UI from current inputs;
 * - event handlers when responding directly to user actions;
 * - Effects when synchronizing with external systems.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RenderDerivedValueProps {
  readonly initialFirstName: string;
  readonly initialLastName: string;
}

export interface EffectDerivedValueProps {
  readonly initialFirstName: string;
  readonly initialLastName: string;
}

export interface RenderCalculationProps {
  readonly initialPrice: number;
  readonly initialQuantity: number;
}

export interface ExternalSynchronizationProps {
  readonly initialTitle: string;
}

export interface EventDrivenWorkProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Values that can be calculated directly from current state should normally
 * remain derived values rather than being copied into additional state.
 */
export const RenderDerivedValue: FC<RenderDerivedValueProps> = ({
  initialFirstName,
  initialLastName,
}): ReactElement => {
  const [firstName, setFirstName] = useState<string>(initialFirstName);
  const [lastName, setLastName] = useState<string>(initialLastName);

  const fullName: string = `${firstName} ${lastName}`;

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  return (
    <section>
      <label htmlFor="render-derived-first-name">First name</label>
      <input id="render-derived-first-name" value={firstName} onChange={handleFirstNameChange} />

      <label htmlFor="render-derived-last-name">Last name</label>
      <input id="render-derived-last-name" value={lastName} onChange={handleLastNameChange} />

      <p>Full name: {fullName}</p>
    </section>
  );
};

/**
 * Storing a value that is completely derived from other state and then
 * synchronizing it with an Effect introduces an unnecessary render cycle.
 * The calculation can instead happen directly during rendering.
 */
export const EffectDerivedValue: FC<EffectDerivedValueProps> = ({
  initialFirstName,
  initialLastName,
}): ReactElement => {
  const [firstName, setFirstName] = useState<string>(initialFirstName);
  const [lastName, setLastName] = useState<string>(initialLastName);
  const [fullName, setFullName] = useState<string>(`${initialFirstName} ${initialLastName}`);

  useEffect((): void => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  return (
    <section>
      <label htmlFor="effect-derived-first-name">First name</label>
      <input id="effect-derived-first-name" value={firstName} onChange={handleFirstNameChange} />

      <label htmlFor="effect-derived-last-name">Last name</label>
      <input id="effect-derived-last-name" value={lastName} onChange={handleLastNameChange} />

      <p>Full name: {fullName}</p>
    </section>
  );
};

/**
 * A pure calculation can be performed directly during rendering. `useMemo`
 * is useful when the calculation is expensive enough that avoiding repeated
 * calculation is worthwhile; it is not required for ordinary arithmetic.
 */
export const RenderCalculation: FC<RenderCalculationProps> = ({ initialPrice, initialQuantity }): ReactElement => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const total: number = useMemo<number>((): number => price * quantity, [price, quantity]);

  const increasePrice = (): void => {
    setPrice((previousPrice: number): number => previousPrice + 1);
  };

  const increaseQuantity = (): void => {
    setQuantity((previousQuantity: number): number => previousQuantity + 1);
  };

  return (
    <section>
      <p>Price: ${price}</p>
      <p>Quantity: {quantity}</p>
      <p>Total: ${total}</p>

      <button type="button" onClick={increasePrice}>
        Increase price
      </button>

      <button type="button" onClick={increaseQuantity}>
        Increase quantity
      </button>
    </section>
  );
};

/**
 * Synchronizing the browser document title is an Effect use case because the
 * document is an external system outside React's rendered component tree.
 */
export const ExternalSynchronization: FC<ExternalSynchronizationProps> = ({ initialTitle }): ReactElement => {
  const [title, setTitle] = useState<string>(initialTitle);

  useEffect((): void => {
    document.title = title;
  }, [title]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  return (
    <section>
      <label htmlFor="external-synchronization-title">Browser title</label>
      <input id="external-synchronization-title" value={title} onChange={handleChange} />
    </section>
  );
};

/**
 * Work caused directly by a user action belongs in the event handler rather
 * than being represented as state solely to trigger an Effect.
 */
export const EventDrivenWork: FC<EventDrivenWorkProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const [message, setMessage] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleSave = (): void => {
    setMessage(`Saved: ${value}`);
  };

  return (
    <section>
      <label htmlFor="event-driven-value">Value</label>
      <input id="event-driven-value" value={value} onChange={handleChange} />

      <button type="button" onClick={handleSave}>
        Save value
      </button>

      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RenderVsEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Deriving values directly during rendering</h2>
      <RenderDerivedValue initialFirstName="John" initialLastName="Doe" />

      <h2>2. Avoiding Effects for derived state</h2>
      <EffectDerivedValue initialFirstName="John" initialLastName="Doe" />

      <h2>3. Calculating values from current state</h2>
      <RenderCalculation initialPrice={10} initialQuantity={2} />

      <h2>4. Using an Effect for external synchronization</h2>
      <ExternalSynchronization initialTitle="Example page" />

      <h2>5. Handling user actions in event handlers</h2>
      <EventDrivenWork initialValue="example.com" />
    </main>
  );
};

export default RenderVsEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Render logic is the normal place to calculate values from current props
//   and state.
// - Derived values should generally not be copied into state and synchronized
//   with an Effect.
// - An Effect is appropriate when React must synchronize with an external
//   system.
// - `useEffect` is not a replacement for ordinary render calculations.
// - `useMemo` can optimize an expensive pure calculation but is not required
//   for simple calculations.
// - Event handlers are the normal place for work caused directly by a user
//   interaction.
// - State is appropriate for independent values that represent their own
//   source of truth rather than a calculation of existing state.
// - A useful decision rule is: calculate during render, respond in an event
//   handler, or synchronize with an external system using an Effect.
// - Choosing an Effect only because code needs to run after rendering is not
//   sufficient; the code should actually synchronize with something outside
//   React.
