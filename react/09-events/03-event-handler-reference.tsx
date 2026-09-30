/**
 * Event Handler Reference
 * =======================
 *
 * A React event prop expects a function reference that React can invoke when the corresponding
 * event occurs. Passing a function reference preserves the separation between rendering and event
 * handling: rendering describes what should be attached, while React invokes the handler later
 * when the user interaction occurs.
 *
 * Function references can point to named functions declared inside or outside the component.
 * A common mistake is to invoke a handler while rendering, such as `onClick={handleClick()}`.
 * That expression executes immediately and passes the function's return value to `onClick`
 * instead of passing the handler itself.
 */

import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NamedHandlerReferenceProps {
  readonly label: string;
}

export interface InlineHandlerReferenceProps {
  readonly initialCount: number;
}

export interface ExternalHandlerReferenceProps {
  readonly label: string;
}

export interface HandlerReferenceGotchaProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A named function can be passed directly to `onClick`. React stores the
 * function reference and invokes it when the button is clicked.
 */
export const NamedHandlerReference: React.FC<NamedHandlerReferenceProps> = ({ label }): React.ReactElement => {
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
 * An inline arrow function is itself a function reference. React invokes
 * the function when the click occurs rather than during JSX evaluation.
 */
export const InlineHandlerReference: React.FC<InlineHandlerReferenceProps> = ({ initialCount }): React.ReactElement => {
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
 * A function that does not depend on component-local values can be defined
 * outside the component and passed directly as the event handler reference.
 */
const handleExternalClick = (): void => {
  console.log("External handler executed");
};

export const ExternalHandlerReference: React.FC<ExternalHandlerReferenceProps> = ({ label }): React.ReactElement => {
  return (
    <button type="button" onClick={handleExternalClick}>
      {label}
    </button>
  );
};

/**
 * Invoking a handler during rendering is different from passing its
 * reference. The handler below returns a function so the example remains
 * valid, but `handleClick()` still executes while JSX is rendered.
 */
export const HandlerReferenceGotcha: React.FC<HandlerReferenceGotchaProps> = ({ label }): React.ReactElement => {
  const [clickCount, setClickCount] = useState<number>(0);

  const handleClick = (): (() => void) => {
    console.log("Handler function executed during render");

    return (): void => {
      setClickCount((previousCount: number): number => previousCount + 1);
    };
  };

  return (
    <div>
      <p>Clicks: {clickCount}</p>
      <button type="button" onClick={handleClick()}>
        {label}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventHandlerReferenceDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Named Function Reference</h2>
      <NamedHandlerReference label="Named Handler" />

      <h2>2. Inline Function Reference</h2>
      <InlineHandlerReference initialCount={0} />

      <h2>3. External Function Reference</h2>
      <ExternalHandlerReference label="External Handler" />

      <h2>4. Function Invocation During Rendering</h2>
      <HandlerReferenceGotcha label="Incorrect Reference Pattern" />
    </div>
  );
};

export default EventHandlerReferenceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React event props receive function references that React invokes during event dispatch.
// - `onClick={handleClick}` passes the handler reference without executing it.
// - An inline arrow function is also a function reference and can be used directly.
// - Functions that do not depend on component-local values can be defined outside the component.
// - `onClick={handleClick()}` invokes the function while rendering instead of passing the handler itself.
// - A handler should return `void` when it performs an event-side effect without producing a
//   value that React needs from the event handler.
