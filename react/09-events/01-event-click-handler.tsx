/**
 * Event Click Handler
 * ===================
 *
 * A click handler is a function registered with an element's `onClick` prop that React invokes
 * when the element receives a click event. React associates the handler with the rendered element
 * and invokes it during the event's dispatch process, passing a React `MouseEvent` object to the
 * handler when the function accepts an event parameter.
 *
 * A handler can perform synchronous logic, update component state, or invoke other application
 * logic. The handler must be passed as a function reference rather than executed during rendering;
 * passing `handleClick()` would invoke the function while React renders instead of waiting for the
 * user interaction.
 *
 * React event handlers use the `onClick` JSX prop rather than the browser's lowercase `onclick`
 * attribute. The handler runs after the click occurs and can read the event data or update state,
 * which schedules another render with the resulting state.
 */

import { type MouseEvent, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicClickHandlerProps {
  readonly label: string;
}

export interface StatefulClickHandlerProps {
  readonly initialCount: number;
}

export interface EventParameterClickHandlerProps {
  readonly label: string;
}

export interface ClickHandlerGotchaProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Registers a function reference with `onClick` and runs it when the
 * button receives a click event.
 */
export const BasicClickHandler: React.FC<BasicClickHandlerProps> = ({ label }): React.ReactElement => {
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
 * A click handler can update component state. The functional updater is
 * used because the next count depends on the previous count.
 */
export const StatefulClickHandler: React.FC<StatefulClickHandlerProps> = ({ initialCount }): React.ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const handleClick = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <div>
      <p>Clicks: {count}</p>
      <button type="button" onClick={handleClick}>
        Increment
      </button>
    </div>
  );
};

/**
 * React passes the click event to the handler when the handler declares
 * an event parameter. The event can be inspected without manually
 * attaching a native browser listener.
 */
export const EventParameterClickHandler: React.FC<EventParameterClickHandlerProps> = ({
  label,
}): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Clicked element:", event.currentTarget);
    console.log("Event target:", event.target);
    console.log("Mouse button:", event.button);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * Calling the handler during render executes it immediately rather than
 * registering it for the future click event. The handler reference must
 * therefore be passed without parentheses.
 */
export const ClickHandlerGotcha: React.FC<ClickHandlerGotchaProps> = ({ label }): React.ReactElement => {
  const [clickCount, setClickCount] = useState<number>(0);

  const handleClick = (): void => {
    setClickCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <div>
      <p>Clicks: {clickCount}</p>
      <button type="button" onClick={handleClick}>
        {label}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventClickHandlerDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Basic Click Handler</h2>
      <BasicClickHandler label="Click Me" />

      <h2>2. Click Handler Updating State</h2>
      <StatefulClickHandler initialCount={0} />

      <h2>3. Click Handler Receiving an Event</h2>
      <EventParameterClickHandler label="Inspect Click Event" />

      <h2>4. Passing a Handler Reference</h2>
      <ClickHandlerGotcha label="Run Handler on Click" />
    </div>
  );
};

export default EventClickHandlerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `onClick` registers a React event handler for click events.
// - Pass a function reference to `onClick`; do not invoke the function during render with `onClick={handleClick()}`.
// - React invokes the handler when the associated element is clicked.
// - A handler can update component state, which schedules a re-render.
// - When a handler declares an event parameter, React supplies the corresponding `MouseEvent` object.
// - `event.target` identifies the originating event target, while `event.currentTarget` identifies the element with the handler.
// - Use functional state updates when the next state depends on the previous state.
