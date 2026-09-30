/**
 * WebSocket Connection
 * ====================
 *
 * A WebSocket connection represents the lifecycle of a persistent client-server
 * communication channel. The browser creates a WebSocket object in the
 * CONNECTING state, performs the opening handshake asynchronously, and moves
 * to OPEN when the handshake succeeds. The connection can later move through
 * CLOSING to CLOSED.
 *
 * The WebSocket API exposes lifecycle events through `open`, `error`, and
 * `close` events. The `message` event is used for application data after the
 * connection has opened. The `close` event provides a CloseEvent containing
 * information such as the numeric close code, reason, and whether the close
 * was clean.
 *
 * React should treat the WebSocket object as an external resource. Creating
 * the connection inside an effect ties it to the component lifecycle, while
 * the effect cleanup closes the socket when the component unmounts or when
 * its connection URL changes. A ref can retain the current socket without
 * making the socket itself part of rendered state.
 *
 * A WebSocket URL normally uses the `ws:` or `wss:` scheme. `wss:` provides
 * WebSocket communication over TLS and is normally used when the surrounding
 * application is served securely. The browser and server negotiate the
 * actual WebSocket protocol during the opening handshake.
 *
 * A common misconception is that constructing a WebSocket means the
 * connection is immediately ready. Construction starts an asynchronous
 * connection attempt, so application code should wait for the `open` event
 * or check `readyState` before sending data. Another common misconception is
 * that a closed connection automatically reconnects. The standard WebSocket
 * API does not provide automatic reconnection; reconnect behavior must be
 * implemented by the application when required.
 */

import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WebSocketConnectionProps {
  readonly url: string;
}

export interface WebSocketConnectionStateProps {
  readonly url: string;
}

export interface WebSocketConnectionEventsProps {
  readonly url: string;
}

export interface WebSocketConnectionCloseProps {
  readonly url: string;
}

export interface WebSocketConnectionRefProps {
  readonly url: string;
}

export interface WebSocketConnectionSendProps {
  readonly url: string;
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates establishing a WebSocket connection and tracking whether its
 * opening handshake has completed.
 */
export const WebSocketConnection: React.FC<WebSocketConnectionProps> = ({
  url,
}: WebSocketConnectionProps): React.ReactElement => {
  const [connectionState, setConnectionState] = useState<"connecting" | "open" | "closed" | "error">("connecting");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    setConnectionState("connecting");

    const handleOpen = (): void => {
      setConnectionState("open");
    };

    const handleError = (): void => {
      setConnectionState("error");
    };

    const handleClose = (): void => {
      setConnectionState("closed");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p>Connection state: {connectionState}</p>
    </section>
  );
};

/**
 * Demonstrates the WebSocket readyState property.
 *
 * readyState is a numeric value defined by the WebSocket API. The component
 * converts the value into a readable label for the UI.
 */
export const WebSocketConnectionState: React.FC<WebSocketConnectionStateProps> = ({
  url,
}: WebSocketConnectionStateProps): React.ReactElement => {
  const [readyState, setReadyState] = useState<number>(globalThis.WebSocket.CONNECTING);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const updateReadyState = (): void => {
      setReadyState(socket.readyState);
    };

    socket.addEventListener("open", updateReadyState);
    socket.addEventListener("error", updateReadyState);
    socket.addEventListener("close", updateReadyState);

    return (): void => {
      socket.removeEventListener("open", updateReadyState);
      socket.removeEventListener("error", updateReadyState);
      socket.removeEventListener("close", updateReadyState);

      if (socket.readyState === globalThis.WebSocket.CONNECTING || socket.readyState === globalThis.WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [url]);

  const stateLabel: string =
    readyState === globalThis.WebSocket.CONNECTING
      ? "CONNECTING"
      : readyState === globalThis.WebSocket.OPEN
        ? "OPEN"
        : readyState === globalThis.WebSocket.CLOSING
          ? "CLOSING"
          : "CLOSED";

  return (
    <section>
      <p>readyState: {stateLabel}</p>
    </section>
  );
};

/**
 * Demonstrates registering separate WebSocket lifecycle event handlers.
 *
 * The browser invokes these handlers when the corresponding external events
 * occur. The component records which lifecycle event was most recently
 * observed.
 */
export const WebSocketConnectionEvents: React.FC<WebSocketConnectionEventsProps> = ({
  url,
}: WebSocketConnectionEventsProps): React.ReactElement => {
  const [lastEvent, setLastEvent] = useState<string>("No WebSocket event received.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleOpen = (): void => {
      setLastEvent("open");
    };

    const handleError = (): void => {
      setLastEvent("error");
    };

    const handleClose = (): void => {
      setLastEvent("close");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <p>Last lifecycle event: {lastEvent}</p>
    </section>
  );
};

/**
 * Demonstrates reading information from the close event.
 *
 * A close event contains a code and reason supplied by the WebSocket protocol
 * or application. The `wasClean` property indicates whether the connection
 * closed in a manner the browser considers clean.
 */
export const WebSocketConnectionClose: React.FC<WebSocketConnectionCloseProps> = ({
  url,
}: WebSocketConnectionCloseProps): React.ReactElement => {
  const [closeDetails, setCloseDetails] = useState<string>("The connection has not closed yet.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleClose = (event: CloseEvent): void => {
      setCloseDetails(
        `Code: ${event.code}; reason: ${event.reason || "No reason supplied"}; clean: ${event.wasClean ? "yes" : "no"}`,
      );
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
      <p>Close details: {closeDetails}</p>
    </section>
  );
};

/**
 * Demonstrates keeping the current WebSocket instance in a ref.
 *
 * The ref provides stable access to the external connection from event handlers
 * and imperative functions without using the socket object as React render
 * state.
 */
export const WebSocketConnectionRef: React.FC<WebSocketConnectionRefProps> = ({
  url,
}: WebSocketConnectionRefProps): React.ReactElement => {
  const socketRef = useRef<globalThis.WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Disconnected.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    socketRef.current = socket;

    const handleOpen = (): void => {
      setStatus("Connected.");
    };

    const handleClose = (): void => {
      setStatus("Closed.");
    };

    const handleError = (): void => {
      setStatus("Connection error.");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);

      socket.close();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [url]);

  return (
    <section>
      <p>{status}</p>
      <p>Socket reference available: {socketRef.current !== null ? "yes" : "no"}</p>
    </section>
  );
};

/**
 * Demonstrates guarding `send` with the OPEN ready state.
 *
 * Calling `send` before the opening handshake has completed is unsafe. The
 * component checks the current state before attempting to send the message.
 */
export const WebSocketConnectionSend: React.FC<WebSocketConnectionSendProps> = ({
  url,
  message,
}: WebSocketConnectionSendProps): React.ReactElement => {
  const socketRef = useRef<globalThis.WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    socketRef.current = socket;

    const handleOpen = (): void => {
      setStatus("Connection is open.");
    };

    const handleClose = (): void => {
      setStatus("Connection is closed.");
    };

    const handleError = (): void => {
      setStatus("Connection error.");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);

      socket.close();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [url]);

  const handleSend = (): void => {
    const socket: globalThis.WebSocket | null = socketRef.current;

    if (socket === null) {
      setStatus("No WebSocket connection exists.");

      return;
    }

    if (socket.readyState !== globalThis.WebSocket.OPEN) {
      setStatus("The WebSocket is not open, so the message was not sent.");

      return;
    }

    socket.send(message);

    setStatus("Message sent.");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={handleSend} disabled={message.length === 0}>
        Send Message
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleWebSocketUrl: string = "wss://example.com/socket";

export const WebSocketConnectionDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>WebSocket Connection</h1>

      <h2>1. Establish and Track a WebSocket Connection</h2>
      <WebSocketConnection url={exampleWebSocketUrl} />

      <h2>2. Read the WebSocket readyState</h2>
      <WebSocketConnectionState url={exampleWebSocketUrl} />

      <h2>3. Handle WebSocket Lifecycle Events</h2>
      <WebSocketConnectionEvents url={exampleWebSocketUrl} />

      <h2>4. Inspect WebSocket Close Information</h2>
      <WebSocketConnectionClose url={exampleWebSocketUrl} />

      <h2>5. Store the Active WebSocket in a Ref</h2>
      <WebSocketConnectionRef url={exampleWebSocketUrl} />

      <h2>6. Send Only When the WebSocket Is Open</h2>
      <WebSocketConnectionSend url={exampleWebSocketUrl} message="Hello from the browser." />
    </main>
  );
};

export default WebSocketConnectionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Constructing a WebSocket starts an asynchronous connection attempt; it does not immediately produce an open connection.
// - The WebSocket readyState progresses through CONNECTING, OPEN, CLOSING, and CLOSED.
// - The open event indicates that the opening handshake has completed successfully.
// - The error and close events provide lifecycle information when a connection encounters a problem or terminates.
// - CloseEvent exposes the close code, reason, and wasClean status.
// - React effects can create WebSocket connections and return cleanup functions that close them.
// - A ref can hold the active WebSocket instance without making the external resource part of rendered React state.
// - Messages should be sent only when readyState is OPEN.
// - The browser WebSocket API does not automatically reconnect a closed connection.
// - Production connections commonly require explicit authentication, reconnection, heartbeat, and recovery behavior.
