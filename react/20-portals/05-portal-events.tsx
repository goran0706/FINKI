/**
 * Portal Events
 * =============
 *
 * Portals change where React elements are placed in the DOM, but they do not
 * create a separate React event hierarchy. Events originating from portal
 * content still participate in React's event propagation through the React
 * component tree.
 *
 * As a result, an event can bubble from a portal child to a React parent even
 * when the portal child is mounted under a different DOM element. DOM-based
 * propagation and React-based propagation therefore need to be distinguished
 * when working with portals.
 */

import { type FC, type MouseEvent, type ReactElement, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PortalEventProps {
  readonly target: HTMLElement;
}

export interface PortalEventContentProps {
  readonly children: ReactNode;
  readonly target: HTMLElement;
}

export interface EventLogProps {
  readonly events: readonly string[];
}

export interface PropagationDemoProps {
  readonly target: HTMLElement;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates that a click inside a portal can bubble through the React tree.
 *
 * The portal button is placed into a separate DOM container, but its React
 * parent still receives the event because React propagation follows the
 * component hierarchy.
 */
export const PortalEventBubblingExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [clickCount, setClickCount] = useState<number>(0);

  const handleParentClick = (): void => {
    setClickCount((current) => current + 1);
  };

  return (
    <section onClick={handleParentClick}>
      <h2>React event bubbling through a portal</h2>
      <p>Parent received portal clicks: {clickCount}</p>

      {createPortal(
        <button
          type="button"
          onClick={() => {
            // The parent section receives this click through the React tree.
          }}
        >
          Click the portal button
        </button>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates that stopping propagation in the portal prevents the event
 * from reaching the React parent.
 *
 * `stopPropagation()` affects React's event propagation for the dispatched
 * event, so the parent handler is not invoked.
 */
export const PortalStopPropagationExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [parentClicks, setParentClicks] = useState<number>(0);
  const [portalClicks, setPortalClicks] = useState<number>(0);

  const handleParentClick = (): void => {
    setParentClicks((current) => current + 1);
  };

  const handlePortalClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setPortalClicks((current) => current + 1);
  };

  return (
    <section onClick={handleParentClick}>
      <h2>Stopping portal event propagation</h2>
      <p>Parent clicks: {parentClicks}</p>
      <p>Portal clicks: {portalClicks}</p>

      {createPortal(
        <button type="button" onClick={handlePortalClick}>
          Click without bubbling
        </button>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates the distinction between the React tree and the DOM tree.
 *
 * The portal button is physically outside the section in the DOM, but the
 * button remains a React descendant of that section.
 */
export const ReactTreeVsDomTreeExample: FC<PropagationDemoProps> = ({ target }): ReactElement => {
  const [received, setReceived] = useState<boolean>(false);

  const handleParentClick = (): void => {
    setReceived(true);
  };

  return (
    <section onClick={handleParentClick}>
      <h2>React tree versus DOM tree</h2>
      <p>React parent received the portal event: {received ? "yes" : "no"}</p>

      {createPortal(<button type="button">Portal descendant</button>, target)}
    </section>
  );
};

/**
 * Demonstrates using the event's `currentTarget` and `target` values inside
 * a portal event handler.
 *
 * `target` identifies the element where the event originated, while
 * `currentTarget` identifies the element whose handler is currently executing.
 */
export const PortalEventTargetsExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [eventDescription, setEventDescription] = useState<string>("No portal event received.");

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setEventDescription(
      `target=${event.target instanceof HTMLElement ? event.target.tagName : "unknown"}, ` +
        `currentTarget=${event.currentTarget.tagName}`,
    );
  };

  return (
    <section>
      <h2>Portal event target values</h2>
      <p>{eventDescription}</p>

      {createPortal(
        <button type="button" onClick={handleClick}>
          Inspect event targets
        </button>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates that a portal can update state owned by its React ancestor.
 *
 * The portal's DOM location does not prevent it from interacting with state
 * and event handlers belonging to the component that created it.
 */
export const PortalStateInteractionExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [message, setMessage] = useState<string>("No interaction yet.");

  const handlePortalClick = (): void => {
    setMessage("The portal updated state in its React parent.");
  };

  return (
    <section>
      <h2>Portal events and parent state</h2>
      <p>{message}</p>

      {createPortal(
        <button type="button" onClick={handlePortalClick}>
          Update parent state
        </button>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates that event propagation can cross multiple React ancestors
 * around a portal.
 *
 * The portal remains connected to the React hierarchy at the point where
 * `createPortal` is called, so propagation can continue through each React
 * ancestor.
 */
export const NestedPortalPropagationExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [events, setEvents] = useState<readonly string[]>([]);

  const recordEvent = (name: string): void => {
    setEvents((current) => [...current, name]);
  };

  return (
    <section onClick={() => recordEvent("outer React parent")}>
      <h2>Nested React ancestors</h2>

      <div onClick={() => recordEvent("inner React parent")}>
        {createPortal(
          <button type="button" onClick={() => recordEvent("portal button")}>
            Record propagation
          </button>,
          target,
        )}
      </div>

      <EventLog events={events} />
    </section>
  );
};

/**
 * Displays an event-propagation log.
 */
const EventLog: FC<EventLogProps> = ({ events }): ReactElement => {
  return (
    <ul>
      {events.map((eventName, index) => (
        <li key={`${eventName}-${index}`}>{eventName}</li>
      ))}
    </ul>
  );
};

/**
 * Demonstrates a common misconception: the DOM parent of a portal does not
 * determine the portal's React event ancestry.
 *
 * The button is physically mounted in `target`, but its React event ancestry
 * is determined by where `createPortal` appears in the React tree.
 */
export const PortalDomParentMisconception: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [message, setMessage] = useState<string>("Click the portal button.");

  return (
    <section onClick={() => setMessage("The React parent received the event.")}>
      <h2>DOM parent misconception</h2>
      <p>{message}</p>

      {createPortal(<button type="button">Trigger React propagation</button>, target)}
    </section>
  );
};

/**
 * Demonstrates a portal event handler that explicitly receives a typed
 * React mouse event.
 *
 * The generic parameter describes the element on which the handler is
 * declared, so the button handler uses `HTMLButtonElement`.
 */
export const TypedPortalMouseEventExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [buttonText, setButtonText] = useState<string>("Click the button.");

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setButtonText(`Clicked ${event.currentTarget.textContent ?? "button"}.`);
  };

  return (
    <section>
      <h2>Typed portal mouse event</h2>
      <p>{buttonText}</p>

      {createPortal(
        <button type="button" onClick={handleClick}>
          Portal event
        </button>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates an edge case where a native DOM event listener and a React
 * event handler observe different propagation relationships.
 *
 * The native listener follows the physical DOM hierarchy, while the React
 * handler follows the React tree for the portal relationship.
 */
export const NativeVsReactEventExample: FC<PortalEventProps> = ({ target }): ReactElement => {
  const [message, setMessage] = useState<string>("Click the portal button.");

  const handleParentClick = (): void => {
    setMessage("The React parent received the portal event.");
  };

  return (
    <section onClick={handleParentClick}>
      <h2>Native DOM versus React propagation</h2>
      <p>{message}</p>

      {createPortal(
        <button
          type="button"
          onClick={() => setMessage("The portal handler ran before React propagation reached its parent.")}
        >
          Compare propagation models
        </button>,
        target,
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalEventsDemo: FC = (): ReactElement => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useState(() => {
    if (typeof document !== "undefined") {
      const existingTarget: HTMLElement | null = document.getElementById("portal-events-root");

      if (existingTarget) {
        setPortalTarget(existingTarget);
        return;
      }

      const createdTarget: HTMLDivElement = document.createElement("div");

      createdTarget.id = "portal-events-root";
      document.body.appendChild(createdTarget);
      setPortalTarget(createdTarget);
    }
  });

  if (!portalTarget) {
    return (
      <main>
        <h1>Portal Events</h1>
        <p>Preparing the portal event destination.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Portal Events</h1>

      <PortalEventBubblingExample target={portalTarget} />

      <PortalStopPropagationExample target={portalTarget} />

      <ReactTreeVsDomTreeExample target={portalTarget} />

      <PortalEventTargetsExample target={portalTarget} />

      <PortalStateInteractionExample target={portalTarget} />

      <NestedPortalPropagationExample target={portalTarget} />

      <PortalDomParentMisconception target={portalTarget} />

      <TypedPortalMouseEventExample target={portalTarget} />

      <NativeVsReactEventExample target={portalTarget} />
    </main>
  );
};

export default PortalEventsDemo;

// ---------------------------------------------------------------------
// Summary
// Portal events participate in React event propagation through the React tree.
// A portal can bubble an event to a React parent even when its DOM node is elsewhere.
// The DOM hierarchy and React hierarchy can therefore have different event ancestry.
// `stopPropagation()` can prevent the portal event from reaching React ancestors.
// `event.target` identifies the originating element, while `event.currentTarget` identifies the active handler element.
// Portal content can interact with state and handlers owned by its React ancestors.
// Typed portal event handlers use the element on which the handler is declared.
// Native DOM propagation follows physical DOM relationships and should not be confused with React portal propagation.
// A portal does not create a separate React event tree.
// ---------------------------------------------------------------------
