/**
 * Server-Sent Events
 * ==================
 *
 * Server-Sent Events (SSE) is a browser API for receiving a continuous stream of HTTP events
 * from a server. An `EventSource` opens a long-lived HTTP connection and allows the server to
 * send text-based events to the browser whenever new data becomes available. Unlike WebSockets,
 * SSE is unidirectional: the client receives events from the server but does not send messages
 * back through the same connection.
 *
 * An SSE stream uses the `text/event-stream` media type and represents events as UTF-8 text
 * separated by blank lines. Standard fields include `event`, `data`, `id`, and `retry`. The
 * browser automatically attempts to reconnect when an EventSource connection is lost, and the
 * server can provide a `retry` value to influence the reconnection delay. `EventSource` also
 * exposes the `message`, `open`, and `error` events, while named server events are received
 * through event-specific listeners.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface ServerSentEventsProps {
  readonly url: string;
}

interface NamedSseEventProps {
  readonly url: string;
  readonly eventName: string;
}

interface SseConnectionStateProps {
  readonly url: string;
  readonly withCredentials: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Receives standard SSE messages with EventSource.
 *
 * Messages without an explicit `event` field are delivered through the `message` event. The
 * browser converts the received SSE stream into MessageEvent objects and exposes the event data
 * through the `data` property.
 */
export const ServerSentEvents: React.FC<ServerSentEventsProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");
  const [message, setMessage] = useState<string>("No message received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    eventSource.onopen = (_event: Event): void => {
      setStatus("Connected");
    };

    eventSource.onmessage = (event: MessageEvent<string>): void => {
      setMessage(event.data);
    };

    eventSource.onerror = (_event: Event): void => {
      setStatus(
        eventSource.readyState === EventSource.CLOSED ? "Closed" : "Connection interrupted; browser may reconnect",
      );
    };

    return (): void => {
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>Status: {status}</p>
      <p>Latest message: {message}</p>
    </div>
  );
};

/**
 * Receives a named SSE event.
 *
 * An SSE event containing `event: stock-update` is not delivered through the generic `message`
 * handler. It must instead be registered with the corresponding event name. The event name is
 * application-defined and can represent different event types within the same stream.
 */
export const NamedSseEvent: React.FC<NamedSseEventProps> = ({ url, eventName }): React.ReactElement => {
  const [message, setMessage] = useState<string>("No named event received");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleNamedEvent = (event: Event): void => {
      if (event instanceof MessageEvent) {
        setMessage(event.data);
      }
    };

    eventSource.addEventListener(eventName, handleNamedEvent);

    return (): void => {
      eventSource.removeEventListener(eventName, handleNamedEvent);
      eventSource.close();
    };
  }, [eventName, url]);

  return (
    <div>
      <p>Event name: {eventName}</p>
      <p>Latest event: {message}</p>
    </div>
  );
};

/**
 * Demonstrates credentialed SSE connections.
 *
 * EventSource does not expose a general API for setting arbitrary HTTP request headers. When
 * `withCredentials` is true, the browser may include applicable credentials such as cookies,
 * subject to the server's CORS and credential configuration. This is commonly used when an SSE
 * endpoint relies on an existing authenticated browser session.
 */
export const SseConnectionState: React.FC<SseConnectionStateProps> = ({ url, withCredentials }): React.ReactElement => {
  const [state, setState] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url, {
      withCredentials,
    });

    const handleOpen = (_event: Event): void => {
      setState("Open");
    };

    const handleError = (_event: Event): void => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        setState("Reconnecting");
        return;
      }

      if (eventSource.readyState === EventSource.CLOSED) {
        setState("Closed");
      }
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
      <p>Connection state: {state}</p>
      <p>Credentials enabled: {withCredentials ? "yes" : "no"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ServerSentEventsExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Server-Sent Events</h1>

      <h2>1. Receiving Standard SSE Messages</h2>
      <ServerSentEvents url="https://example.com/events" />

      <h2>2. Receiving Named SSE Events</h2>
      <NamedSseEvent url="https://example.com/events" eventName="notification" />

      <h2>3. Credentialed SSE Connections</h2>
      <SseConnectionState url="https://example.com/events" withCredentials={true} />
    </main>
  );
};

export default ServerSentEventsExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `EventSource` provides a browser API for receiving a continuous HTTP event stream.
// - SSE is unidirectional: the server sends events to the client through the open connection.
// - An SSE endpoint normally responds with the `text/event-stream` media type.
// - Events without an explicit `event` field are delivered through the `message` event.
// - Named events require an event-specific listener registered with the corresponding event name.
// - `EventSource` automatically attempts to reconnect after an interrupted connection.
// - `readyState` distinguishes CONNECTING, OPEN, and CLOSED EventSource states.
// - Calling `close()` stops the EventSource and prevents further automatic reconnection.
// - `withCredentials` allows applicable browser credentials such as cookies to participate in a credentialed request.
// - EventSource does not provide a general API for setting arbitrary HTTP request headers.
