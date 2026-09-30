/**
 * WebSocket Events
 * ================
 *
 * WebSocket events expose the lifecycle and incoming data of a browser
 * WebSocket connection. The main events are `open`, `message`, `error`, and
 * `close`. Each event is dispatched asynchronously by the browser as the
 * connection changes state or receives data.
 *
 * The `open` event is emitted after the WebSocket opening handshake succeeds.
 * It is the appropriate lifecycle point for operations that require an open
 * connection, such as sending an initial subscription message.
 *
 * The `message` event carries data received from the server. The `data`
 * property can contain text, a Blob, an ArrayBuffer, or another representation
 * depending on the connection configuration and received payload.
 *
 * The `error` event indicates that a WebSocket error occurred, but it does not
 * expose detailed protocol diagnostics through the event object. Applications
 * normally use the subsequent `close` event to determine that the connection
 * terminated and to inspect its close code and reason.
 *
 * The `close` event is represented by CloseEvent and exposes `code`, `reason`,
 * and `wasClean`. The event is emitted after the connection has transitioned
 * toward the closed state.
 *
 * React components should register event listeners inside an effect and remove
 * them during cleanup. This prevents listeners from accumulating when the
 * component rerenders, unmounts, or receives a different WebSocket URL.
 *
 * A common misconception is that the `error` event contains enough information
 * to determine exactly why a WebSocket failed. Browser WebSocket error details
 * are intentionally limited. Another misconception is that `message` events
 * always contain JSON strings; applications must inspect and validate the
 * received data before interpreting it.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WebSocketEventsProps {
  readonly url: string;
}

export interface WebSocketOpenEventProps {
  readonly url: string;
}

export interface WebSocketMessageEventProps {
  readonly url: string;
}

export interface WebSocketErrorEventProps {
  readonly url: string;
}

export interface WebSocketCloseEventProps {
  readonly url: string;
}

export interface WebSocketEventLogProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates handling the WebSocket `open` event.
 *
 * The open handler runs after the connection has completed its opening
 * handshake and is ready for application communication.
 */
export const WebSocketOpenEvent: React.FC<WebSocketOpenEventProps> = ({
  url,
}: WebSocketOpenEventProps): React.ReactElement => {
  const [status, setStatus] = useState<string>("Waiting for the open event.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleOpen = (): void => {
      setStatus("The WebSocket connection is open.");
    };

    const handleClose = (): void => {
      setStatus("The WebSocket connection closed.");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p>{status}</p>
    </section>
  );
};

/**
 * Demonstrates handling the WebSocket `message` event.
 *
 * The event data is inspected at runtime instead of being assumed to have a
 * particular type. This is important because TypeScript does not validate
 * data arriving over a network connection.
 */
export const WebSocketMessageEvent: React.FC<WebSocketMessageEventProps> = ({
  url,
}: WebSocketMessageEventProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No message received.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setMessage(event.data);

        return;
      }

      if (event.data instanceof ArrayBuffer) {
        setMessage(`Received an ArrayBuffer containing ${event.data.byteLength} bytes.`);

        return;
      }

      if (event.data instanceof Blob) {
        setMessage(`Received a Blob containing ${event.data.size} bytes.`);

        return;
      }

      setMessage("Received WebSocket data in an unsupported representation.");
    };

    socket.addEventListener("message", handleMessage);

    return (): void => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p>Latest message: {message}</p>
    </section>
  );
};

/**
 * Demonstrates handling the WebSocket `error` event.
 *
 * The browser's Event object does not expose a detailed protocol error
 * description. The component therefore records that an error occurred rather
 * than attempting to infer a specific failure cause.
 */
export const WebSocketErrorEvent: React.FC<WebSocketErrorEventProps> = ({
  url,
}: WebSocketErrorEventProps): React.ReactElement => {
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleError = (_event: Event): void => {
      setHasError(true);
    };

    socket.addEventListener("error", handleError);

    return (): void => {
      socket.removeEventListener("error", handleError);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p role="status">{hasError ? "A WebSocket error event occurred." : "No WebSocket error event has occurred."}</p>
    </section>
  );
};

/**
 * Demonstrates handling the WebSocket `close` event.
 *
 * CloseEvent provides information about how the connection ended. The close
 * code and reason are useful for application-level diagnostics and recovery
 * decisions.
 */
export const WebSocketCloseEvent: React.FC<WebSocketCloseEventProps> = ({
  url,
}: WebSocketCloseEventProps): React.ReactElement => {
  const [closeMessage, setCloseMessage] = useState<string>("The WebSocket has not closed.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleClose = (event: CloseEvent): void => {
      const reason: string = event.reason.length > 0 ? event.reason : "No reason supplied";

      setCloseMessage(`Code ${event.code}; reason: ${reason}; clean: ${event.wasClean ? "yes" : "no"}.`);
    };

    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("close", handleClose);

      if (socket.readyState === globalThis.WebSocket.CONNECTING || socket.readyState === globalThis.WebSocket.OPEN) {
        socket.close(1000, "Component cleanup");
      }
    };
  }, [url]);

  return (
    <section>
      <p>Close event: {closeMessage}</p>
    </section>
  );
};

/**
 * Demonstrates recording several WebSocket events in the order they are
 * observed by the component.
 *
 * The event log is intentionally bounded to the latest ten entries so that
 * repeated network activity cannot cause unbounded client-side state growth.
 */
export const WebSocketEventLog: React.FC<WebSocketEventLogProps> = ({
  url,
}: WebSocketEventLogProps): React.ReactElement => {
  const [events, setEvents] = useState<string[]>([]);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const addEvent = (eventName: string): void => {
      setEvents((previousEvents: string[]): string[] => [...previousEvents.slice(-9), eventName]);
    };

    const handleOpen = (): void => {
      addEvent("open");
    };

    const handleMessage = (): void => {
      addEvent("message");
    };

    const handleError = (): void => {
      addEvent("error");
    };

    const handleClose = (): void => {
      addEvent("close");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p>Recent WebSocket events:</p>

      {events.length === 0 ? (
        <p>No events received yet.</p>
      ) : (
        <ol>
          {events.map((eventName: string, index: number): React.ReactElement => (
            <li key={`${eventName}-${index}`}>{eventName}</li>
          ))}
        </ol>
      )}
    </section>
  );
};

/**
 * Demonstrates the relationship between WebSocket events.
 *
 * The component records whether the connection has opened and whether a close
 * event has subsequently occurred. The message event is independent data
 * activity that can happen while the connection is open.
 */
export const WebSocketEvents: React.FC<WebSocketEventsProps> = ({ url }: WebSocketEventsProps): React.ReactElement => {
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "open" | "closed" | "error">("connecting");
  const [messageCount, setMessageCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleOpen = (): void => {
      setConnectionStatus("open");
    };

    const handleMessage = (): void => {
      setMessageCount((previousCount: number): number => previousCount + 1);
    };

    const handleError = (): void => {
      setConnectionStatus("error");
    };

    const handleClose = (): void => {
      setConnectionStatus("closed");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p>Connection status: {connectionStatus}</p>

      <p>Messages received: {messageCount}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleWebSocketUrl: string = "wss://example.com/socket";

export const WebSocketEventsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>WebSocket Events</h1>

      <h2>1. Handle the WebSocket open Event</h2>
      <WebSocketOpenEvent url={exampleWebSocketUrl} />

      <h2>2. Handle WebSocket message Events</h2>
      <WebSocketMessageEvent url={exampleWebSocketUrl} />

      <h2>3. Handle the WebSocket error Event</h2>
      <WebSocketErrorEvent url={exampleWebSocketUrl} />

      <h2>4. Handle the WebSocket close Event</h2>
      <WebSocketCloseEvent url={exampleWebSocketUrl} />

      <h2>5. Record WebSocket Events</h2>
      <WebSocketEventLog url={exampleWebSocketUrl} />

      <h2>6. Track Connection and Message Events Together</h2>
      <WebSocketEvents url={exampleWebSocketUrl} />
    </main>
  );
};

export default WebSocketEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The WebSocket API exposes open, message, error, and close events.
// - The open event indicates that the opening handshake has completed.
// - The message event delivers server data that must be inspected and validated at runtime.
// - WebSocket message data is not necessarily JSON or even text.
// - The error event indicates a WebSocket failure but does not provide detailed protocol diagnostics.
// - The close event provides a CloseEvent containing the close code, reason, and wasClean value.
// - React effects should register WebSocket listeners and remove them during cleanup.
// - Functional state updates are appropriate when multiple WebSocket events update the same state value.
// - Event history should be bounded when retaining events to avoid unnecessary unbounded client-side memory growth.
// - A close event commonly provides more actionable lifecycle information than the error event alone.
