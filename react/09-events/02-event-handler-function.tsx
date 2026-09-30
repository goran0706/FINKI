/**
 * Event Handler Function
 * ======================
 *
 * An event handler function is a function supplied to a React event prop such as `onClick`.
 * React stores the handler as part of the rendered element's event configuration and invokes
 * the function when the corresponding event occurs. The function is not called while JSX is
 * being evaluated; React calls it later during event dispatch.
 *
 * Event handlers can be declared as named functions, inline arrow functions, or reusable functions
 * defined outside the component when they do not depend on component-local values. A handler may
 * receive the React event object, access values from its lexical scope, and update component state.
 *
 * The distinction between defining a function and invoking a function is important: `onClick={handler}`
 * passes a function to React, while `onClick={handler()}` executes the function immediately during
 * rendering and passes its return value instead of registering the function itself.
 */

import { type MouseEvent, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NamedEventHandlerProps {
  readonly label: string;
}

export interface InlineEventHandlerProps {
  readonly initialCount: number;
}

export interface EventArgumentHandlerProps {
  readonly label: string;
}

export interface ExternalEventHandlerProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A named handler is declared inside the component and passed to `onClick`
 * as a function reference.
 */
export const NamedEventHandler: React.FC<NamedEventHandlerProps> = ({ label }): React.ReactElement => {
  const handleClick = (): void => {
    console.log(`${label} was clicked`);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * An inline arrow function can be used directly as the event handler.
 * React invokes the function only when the button is clicked.
 */
export const InlineEventHandler: React.FC<InlineEventHandlerProps> = ({ initialCount }): React.ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  return (
    <div>
      <p>Clicks: {count}</p>
      <button
        type="button"
        onClick={(): void => {
          setCount((previousCount: number): number => previousCount + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};

/**
 * A handler function can receive the React event object as its parameter.
 * The event type describes the DOM element associated with the handler.
 */
export const EventArgumentHandler: React.FC<EventArgumentHandlerProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Event type:", event.type);
    console.log("Button text:", event.currentTarget.textContent);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * A handler that does not depend on component-local values can be declared
 * outside the component and reused as a stable function reference.
 */
const handleExternalClick = (): void => {
  console.log("External event handler executed");
};

export const ExternalEventHandler: React.FC<ExternalEventHandlerProps> = ({ label }): React.ReactElement => {
  return (
    <button type="button" onClick={handleExternalClick}>
      {label}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventHandlerFunctionDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Named Event Handler</h2>
      <NamedEventHandler label="Named Handler" />

      <h2>2. Inline Event Handler</h2>
      <InlineEventHandler initialCount={0} />

      <h2>3. Event Handler with an Event Parameter</h2>
      <EventArgumentHandler label="Inspect Event" />

      <h2>4. Reusable External Event Handler</h2>
      <ExternalEventHandler label="External Handler" />
    </div>
  );
};

export default EventHandlerFunctionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An event handler is a function supplied to a React event prop.
// - Named functions can be declared inside a component and passed by reference.
// - Inline arrow functions can be declared directly in JSX.
// - React supplies the event object when the handler accepts an event parameter.
// - A handler that does not depend on component-local values can be declared outside the component and reused.
// - `onClick={handler}` passes the function to React for later execution.
// - `onClick={handler()}` invokes the function during rendering and does not register the function itself as the click handler.
