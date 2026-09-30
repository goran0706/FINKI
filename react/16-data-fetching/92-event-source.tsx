/**
 * EventSource
 * ===========
 *
 * The `EventSource` API provides a browser-managed connection to a server that sends events using
 * the Server-Sent Events (SSE) protocol. The client creates an `EventSource` with an HTTP or HTTPS
 * URL, and the browser maintains the connection while exposing lifecycle events and incoming
 * messages through event handlers.
 *
 * `EventSource` supports three connection states: `CONNECTING`, `OPEN`, and `CLOSED`. When an
 * established connection is interrupted, the browser normally transitions back to `CONNECTING`
 * and automatically attempts to reconnect. Calling `close()` explicitly terminates the connection
 * and prevents further automatic reconnection for that EventSource instance.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface EventSourceLifecycleProps {
  readonly url: string;
}

interface EventSourceMessagesProps {
  readonly url: string;
}

interface EventSourceCredentialsProps {
  readonly url: string;
  readonly withCredentials: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the lifecycle states exposed by EventSource.
 *
 * The browser initially places a new EventSource in the CONNECTING state. After a successful
 * connection it becomes OPEN. A network interruption normally returns it to CONNECTING while the
 * browser attempts to reconnect.
 */
export const EventSourceLifecycle: React.FC<EventSourceLifecycleProps> = ({ url }): React.ReactElement => {
  const [state, setState] = useState<number>(EventSource.CONNECTING);

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setState(EventSource.OPEN);
    };

    const handleError = (_event: Event): void => {
      setState(eventSource.readyState);
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("error", handleError);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [url]);

  const stateName: string =
    state === EventSource.CONNECTING ? "CONNECTING" : state === EventSource.OPEN ? "OPEN" : "CLOSED";

  return (
    <div>
      <p>Ready state: {stateName}</p>
      <p>Numeric state: {state}</p>
    </div>
  );
};

/**
 * Receives both generic and named events from the same EventSource connection.
 *
 * Standard SSE messages are delivered through the `message` event when the server does not specify
 * an event name. Named events are delivered through listeners registered for the server-provided
 * event name.
 */
export const EventSourceMessages: React.FC<EventSourceMessagesProps> = ({ url }): React.ReactElement => {
  const [message, setMessage] = useState<string>("No message received");
  const [notification, setNotification] = useState<string>("No notification received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleMessage = (event: MessageEvent<string>): void => {
      setMessage(event.data);
    };

    const handleNotification = (event: Event): void => {
      if (event instanceof MessageEvent) {
        setNotification(event.data);
      }
    };

    eventSource.addEventListener("message", handleMessage);
    eventSource.addEventListener("notification", handleNotification);

    return (): void => {
      eventSource.removeEventListener("message", handleMessage);
      eventSource.removeEventListener("notification", handleNotification);
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>Generic message: {message}</p>
      <p>Notification: {notification}</p>
    </div>
  );
};

/**
 * Demonstrates the `withCredentials` constructor option.
 *
 * When enabled, the browser can include credentials such as cookies in a cross-origin EventSource
 * request when the server permits credentialed CORS. This option does not provide a mechanism for
 * manually adding arbitrary request headers.
 */
export const EventSourceCredentials: React.FC<EventSourceCredentialsProps> = ({
  url,
  withCredentials,
}): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url, {
      withCredentials,
    });

    const handleOpen = (_event: Event): void => {
      setStatus("Connected");
    };

    const handleError = (_event: Event): void => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        setStatus("Reconnecting");
        return;
      }

      setStatus("Closed");
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("error", handleError);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [url, withCredentials]);

  return (
    <div>
      <p>Status: {status}</p>
      <p>Credentials: {withCredentials ? "enabled" : "disabled"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EventSourceExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>EventSource</h1>

      <h2>1. EventSource Lifecycle States</h2>
      <EventSourceLifecycle url="https://example.com/events" />

      <h2>2. Standard and Named Events</h2>
      <EventSourceMessages url="https://example.com/events" />

      <h2>3. Credentialed EventSource Connections</h2>
      <EventSourceCredentials url="https://example.com/events" withCredentials={true} />
    </main>
  );
};

export default EventSourceExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `EventSource` creates a browser-managed connection for receiving Server-Sent Events.
// - `CONNECTING`, `OPEN`, and `CLOSED` describe the EventSource connection state.
// - `readyState` exposes the current numeric lifecycle state.
// - EventSource normally reconnects automatically after an interrupted connection.
// - Calling `close()` permanently closes that EventSource instance and stops automatic reconnection.
// - Generic SSE messages are delivered through the `message` event.
// - Named SSE events require listeners registered for the corresponding event name.
// - `withCredentials` controls whether applicable browser credentials can participate in credentialed requests.
// - EventSource does not provide a general mechanism for manually setting arbitrary HTTP request headers.
