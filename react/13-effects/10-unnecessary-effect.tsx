/**
 * Unnecessary Effect
 * ==================
 *
 * An Effect is unnecessary when its work can be performed directly during
 * rendering or in response to the event that caused the change. Effects are
 * designed for synchronizing React with systems outside React, so using them
 * for ordinary calculations or event-specific state transformations adds
 * avoidable synchronization and rendering work.
 *
 * A common unnecessary pattern stores a derived value in state and updates it
 * from an Effect. The source state changes first, React renders, the Effect
 * runs after the commit, and the Effect schedules another state update. The
 * derived value can instead be calculated during the original render.
 *
 * Another unnecessary pattern uses an Effect to respond indirectly to a user
 * interaction. If an action is caused by a specific event, the event handler
 * already knows why the action is occurring and can perform the work directly.
 *
 * An Effect remains appropriate when React must synchronize with an external
 * system. Browser APIs, subscriptions, timers, network connections, and
 * imperative third-party APIs are examples of systems outside React.
 *
 * A useful distinction is whether the code is calculating React data,
 * responding to an interaction, or synchronizing an external system:
 * calculations belong in render logic, interaction-specific work belongs in
 * event handlers, and external synchronization belongs in Effects.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DerivedStateEffectProps {
  readonly initialFirstName: string;
  readonly initialLastName: string;
}

export interface EventEffectProps {
  readonly initialMessage: string;
}

export interface RenderCalculationProps {
  readonly initialPrice: number;
  readonly initialQuantity: number;
}

export interface ExternalSynchronizationProps {
  readonly initialTitle: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * This demonstrates the unnecessary derived-state pattern. `fullName` is
 * completely determined by `firstName` and `lastName`, so it does not need
 * its own state or an Effect.
 */
export const DerivedStateEffect: FC<DerivedStateEffectProps> = ({
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
      <label htmlFor="unnecessary-effect-first-name">First name</label>
      <input id="unnecessary-effect-first-name" value={firstName} onChange={handleFirstNameChange} />

      <label htmlFor="unnecessary-effect-last-name">Last name</label>
      <input id="unnecessary-effect-last-name" value={lastName} onChange={handleLastNameChange} />

      <p>Derived full name: {fullName}</p>
    </section>
  );
};

/**
 * When a value should change specifically because of a user action, the event
 * handler can perform that state transition directly. An Effect is not needed
 * merely to copy one state value into another after every change.
 */
export const EventEffect: FC<EventEffectProps> = ({ initialMessage }): ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);
  const [savedMessage, setSavedMessage] = useState<string>(initialMessage);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const handleSave = (): void => {
    setSavedMessage(message);
  };

  return (
    <section>
      <label htmlFor="unnecessary-effect-message">Message</label>
      <input id="unnecessary-effect-message" value={message} onChange={handleChange} />

      <button type="button" onClick={handleSave}>
        Save message
      </button>

      <p>Saved message: {savedMessage}</p>
    </section>
  );
};

/**
 * Ordinary calculations should be performed during rendering. This avoids
 * creating additional state whose only purpose is to hold a calculation.
 */
export const RenderCalculation: FC<RenderCalculationProps> = ({ initialPrice, initialQuantity }): ReactElement => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const total: number = price * quantity;

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
 * An Effect is appropriate when React must synchronize with an external
 * system. The browser document is outside React's component tree, so updating
 * its title belongs in an Effect rather than render logic.
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
      <label htmlFor="unnecessary-effect-title">Document title</label>
      <input id="unnecessary-effect-title" value={title} onChange={handleChange} />
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UnnecessaryEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Deriving values during rendering instead of with an Effect</h2>
      <DerivedStateEffect initialFirstName="John" initialLastName="Doe" />

      <h2>2. Handling event-specific state changes in an event handler</h2>
      <EventEffect initialMessage="example.com" />

      <h2>3. Calculating ordinary derived values during rendering</h2>
      <RenderCalculation initialPrice={10} initialQuantity={2} />

      <h2>4. Using an Effect for external synchronization</h2>
      <ExternalSynchronization initialTitle="Example page" />
    </main>
  );
};

export default UnnecessaryEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Effects are unnecessary when work can be performed during rendering or
//   directly inside the event handler that caused the change.
// - Values derived entirely from props or state should normally be calculated
//   during rendering instead of stored in additional state.
// - Copying one React state value into another with an Effect can introduce an
//   unnecessary additional render.
// - Event-specific state transitions belong in the event handler that knows
//   which user action caused them.
// - Pure calculations do not require Effects.
// - An Effect is appropriate when React must synchronize with an external
//   system such as the browser document, a subscription, timer, or connection.
// - A state update inside an Effect is not automatically wrong; it is justified
//   when it is part of synchronization with an external system.
// - The main decision is whether the code calculates React data, responds to a
//   user event, or synchronizes with something outside React.
