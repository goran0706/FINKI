/**
 * Event Handler Arguments
 * =======================
 *
 * React event handlers can receive arguments in two different ways: React automatically supplies
 * the event object when it invokes the handler, while application-specific arguments must be supplied
 * by the developer. Application arguments are commonly passed through an inline arrow function that
 * calls another function with the required values.
 *
 * The event object is provided by React as the first handler argument. Additional application values
 * are not automatically supplied by React; they must come from the component's scope or be passed
 * explicitly. An inline wrapper such as `onClick={() => handleSelect(id)}` delays the function call
 * until the click occurs while preserving access to the required application value.
 *
 * A common mistake is `onClick={handleSelect(id)}`, which calls `handleSelect` during rendering.
 * The correct distinction is between passing a handler function to React and creating a function
 * that will call the desired handler when the event occurs.
 */

import { type MouseEvent, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface EventObjectArgumentProps {
  readonly label: string;
}

export interface ApplicationArgumentProps {
  readonly initialSelectedId: number;
}

export interface MultipleArgumentsProps {
  readonly initialUserId: number;
}

export interface ArgumentReferenceGotchaProps {
  readonly userId: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * React automatically supplies the event object when it invokes the
 * registered event handler.
 */
export const EventObjectArgument: React.FC<EventObjectArgumentProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Event type:", event.type);
    console.log("Clicked label:", event.currentTarget.textContent);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * Application-specific values are not supplied automatically by React.
 * An inline function can pass the required value when the event occurs.
 */
export const ApplicationArgument: React.FC<ApplicationArgumentProps> = ({ initialSelectedId }): React.ReactElement => {
  const [selectedId, setSelectedId] = useState<number>(initialSelectedId);

  const handleSelect = (id: number): void => {
    setSelectedId(id);
  };

  return (
    <div>
      <p>Selected ID: {selectedId}</p>
      <button
        type="button"
        onClick={(): void => {
          handleSelect(101);
        }}
      >
        Select 101
      </button>
      <button
        type="button"
        onClick={(): void => {
          handleSelect(202);
        }}
      >
        Select 202
      </button>
    </div>
  );
};

/**
 * An inline wrapper can supply multiple application-specific arguments
 * while the event remains available to the wrapper when required.
 */
export const MultipleArguments: React.FC<MultipleArgumentsProps> = ({ initialUserId }): React.ReactElement => {
  const [selectedUserId, setSelectedUserId] = useState<number>(initialUserId);
  const [lastEventType, setLastEventType] = useState<string>("None");

  const handleSelect = (userId: number, eventType: string): void => {
    setSelectedUserId(userId);
    setLastEventType(eventType);
  };

  const handleClick = (userId: number, event: MouseEvent<HTMLButtonElement>): void => {
    handleSelect(userId, event.type);
  };

  return (
    <div>
      <p>Selected user ID: {selectedUserId}</p>
      <p>Last event: {lastEventType}</p>
      <button
        type="button"
        onClick={(event: MouseEvent<HTMLButtonElement>): void => {
          handleClick(303, event);
        }}
      >
        Select User 303
      </button>
    </div>
  );
};

/**
 * Passing an application argument directly invokes the function during
 * rendering. The correct pattern is to create a function that performs
 * the call later, when React dispatches the click event.
 */
export const ArgumentReferenceGotcha: React.FC<ArgumentReferenceGotchaProps> = ({ userId }): React.ReactElement => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number): void => {
    setSelectedId(id);
  };

  return (
    <div>
      <p>Selected ID: {selectedId ?? "None"}</p>
      <button
        type="button"
        onClick={(): void => {
          handleSelect(userId);
        }}
      >
        Select User
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventHandlerArgumentsDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. React-Provided Event Argument</h2>
      <EventObjectArgument label="Inspect Event" />

      <h2>2. Passing an Application Argument</h2>
      <ApplicationArgument initialSelectedId={0} />

      <h2>3. Passing Multiple Arguments</h2>
      <MultipleArguments initialUserId={0} />

      <h2>4. Passing an Argument Without Invoking During Render</h2>
      <ArgumentReferenceGotcha userId={404} />
    </div>
  );
};

export default EventHandlerArgumentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React automatically supplies the event object to an event handler.
// - Application-specific arguments are not automatically supplied by React.
// - Use an inline function to pass application values to another handler.
// - The event can be passed explicitly when both application data and event
//   information are required by the called function.
// - `onClick={handleSelect(id)}` invokes the function during rendering.
// - `onClick={() => handleSelect(id)}` creates a handler that invokes the
//   function later when the click event occurs.
