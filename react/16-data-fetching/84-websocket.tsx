/**
 * WebSocket
 * =========
 *
 * WebSocket is a browser API for maintaining a persistent, bidirectional
 * communication channel between a client and a server. Unlike ordinary HTTP
 * request-response communication, an open WebSocket allows either endpoint to
 * send messages independently after the connection has been established.
 *
 * A WebSocket connection starts with an HTTP-based opening handshake. After
 * the handshake succeeds, the connection switches to the WebSocket protocol
 * and exposes events such as `open`, `message`, `error`, and `close` to the
 * browser application.
 *
 * The browser's WebSocket constructor accepts a URL and optionally a list of
 * subprotocols. The connection is asynchronous, so application code should
 * wait for the `open` event before calling `send`. Calling `send` before the
 * connection is open can fail because the connection has not completed its
 * opening handshake.
 *
 * WebSocket messages are commonly text or binary data. When a server sends
 * JSON text, the application must parse the message and validate the resulting
 * value before using it as typed application data. TypeScript types do not
 * validate data received at runtime.
 *
 * A WebSocket also has a lifecycle represented by `readyState`: CONNECTING,
 * OPEN, CLOSING, and CLOSED. React components should close connections during
 * effect cleanup so that unmounted components do not leave active sockets
 * behind.
 *
 * WebSockets do not automatically provide application-level authentication,
 * reconnection, message ordering guarantees across independently managed
 * connections, or durable event recovery. Production applications commonly
 * define authentication, reconnection, heartbeat, error handling, and
 * resynchronization behavior separately.
 */

import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WebSocketMessage {
  readonly type: string;
  readonly message: string;
}

export interface WebSocketProps {
  readonly url: string;
}

export interface WebSocketConnectionProps {
  readonly url: string;
}

export interface WebSocketMessageProps {
  readonly url: string;
  readonly initialMessage: string;
}

export interface WebSocketSendProps {
  readonly url: string;
  readonly message: string;
}

export interface WebSocketLifecycleProps {
  readonly url: string;
}

export interface WebSocketJsonProps {
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates creating a WebSocket connection and observing its basic
 * connection state.
 *
 * The socket is created inside an effect so that the external connection is
 * associated with the component lifecycle. Cleanup closes the connection when
 * the component is unmounted or when the URL changes.
 */
export const WebSocket: React.FC<WebSocketProps> = ({ url }: WebSocketProps): React.ReactElement => {
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
      <p>WebSocket state: {connectionState}</p>
    </section>
  );
};

/**
 * Demonstrates receiving WebSocket messages.
 *
 * Every `message` event represents data delivered by the server. The component
 * stores the most recent raw message as a string without assuming that the
 * payload is JSON.
 */
export const WebSocketMessage: React.FC<WebSocketMessageProps> = ({
  url,
  initialMessage,
}: WebSocketMessageProps): React.ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setMessage(event.data);
      } else {
        setMessage("Received a non-text WebSocket message.");
      }
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
 * Demonstrates sending a message only after the WebSocket has opened.
 *
 * The component keeps the socket in a ref because the socket is an external
 * mutable resource that should not cause a React render every time its
 * reference changes.
 */
export const WebSocketSend: React.FC<WebSocketSendProps> = ({
  url,
  message,
}: WebSocketSendProps): React.ReactElement => {
  const socketRef = useRef<globalThis.WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    socketRef.current = socket;

    const handleOpen = (): void => {
      setStatus("Connected. The message can now be sent.");
    };

    const handleClose = (): void => {
      setStatus("Connection closed.");
    };

    const handleError = (): void => {
      setStatus("WebSocket connection error.");
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

    if (socket === null || socket.readyState !== globalThis.WebSocket.OPEN) {
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
        Send WebSocket Message
      </button>
    </section>
  );
};

/**
 * Demonstrates the WebSocket lifecycle states.
 *
 * The browser exposes numeric ready-state constants on the WebSocket
 * constructor. The component converts the current numeric state into a
 * readable value for the interface.
 */
export const WebSocketLifecycle: React.FC<WebSocketLifecycleProps> = ({
  url,
}: WebSocketLifecycleProps): React.ReactElement => {
  const [readyState, setReadyState] = useState<number>(globalThis.WebSocket.CONNECTING);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const updateReadyState = (): void => {
      setReadyState(socket.readyState);
    };

    socket.addEventListener("open", updateReadyState);
    socket.addEventListener("close", updateReadyState);
    socket.addEventListener("error", updateReadyState);

    return (): void => {
      socket.removeEventListener("open", updateReadyState);
      socket.removeEventListener("close", updateReadyState);
      socket.removeEventListener("error", updateReadyState);

      if (socket.readyState === globalThis.WebSocket.OPEN || socket.readyState === globalThis.WebSocket.CONNECTING) {
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
      <p>Ready state: {stateLabel}</p>
    </section>
  );
};

/**
 * Demonstrates parsing JSON received through a WebSocket.
 *
 * Runtime validation checks the decoded JSON value before treating it as the
 * expected message shape. A TypeScript interface alone cannot validate
 * untrusted network data.
 */
export const WebSocketJson: React.FC<WebSocketJsonProps> = ({ url }: WebSocketJsonProps): React.ReactElement => {
  const [receivedMessage, setReceivedMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string>("");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data !== "string") {
        setError("Expected a text JSON message.");

        return;
      }

      try {
        const parsed: unknown = JSON.parse(event.data);

        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          setError("The JSON message is not an object.");

          return;
        }

        const candidate: Partial<WebSocketMessage> = parsed as Partial<WebSocketMessage>;

        if (typeof candidate.type !== "string" || typeof candidate.message !== "string") {
          setError("The JSON message does not match the expected shape.");

          return;
        }

        setReceivedMessage({
          type: candidate.type,
          message: candidate.message,
        });
        setError("");
      } catch {
        setError("The WebSocket message is not valid JSON.");
      }
    };

    socket.addEventListener("message", handleMessage);

    return (): void => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      {receivedMessage !== null ? (
        <>
          <p>Message type: {receivedMessage.type}</p>
          <p>Message: {receivedMessage.message}</p>
        </>
      ) : (
        <p>No valid JSON message received.</p>
      )}

      {error.length > 0 && <p role="alert">{error}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleWebSocketUrl: string = "wss://example.com/socket";

export const WebSocketDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>WebSocket</h1>

      <h2>1. Establish a Persistent WebSocket Connection</h2>
      <WebSocket url={exampleWebSocketUrl} />

      <h2>2. Receive Messages From the WebSocket Server</h2>
      <WebSocketMessage url={exampleWebSocketUrl} initialMessage="Waiting for a WebSocket message..." />

      <h2>3. Send a Message Only After the Connection Opens</h2>
      <WebSocketSend url={exampleWebSocketUrl} message="Hello from the browser." />

      <h2>4. Observe WebSocket Connection Lifecycle States</h2>
      <WebSocketLifecycle url={exampleWebSocketUrl} />

      <h2>5. Parse and Validate JSON WebSocket Messages</h2>
      <WebSocketJson url={exampleWebSocketUrl} />
    </main>
  );
};

export default WebSocketDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - WebSocket provides a persistent bidirectional communication channel between a browser and a server.
// - A WebSocket connection must complete its opening handshake before application messages can be sent.
// - The browser exposes open, message, error, and close events for connection lifecycle handling.
// - WebSocket.readyState identifies whether a connection is connecting, open, closing, or closed.
// - WebSocket connections should be closed during React effect cleanup.
// - Messages received from the network are runtime data and must be validated before being treated as typed application objects.
// - A WebSocket does not automatically provide application-level authentication, reconnection, or durable event recovery.
// - Sending a message requires checking that the socket is in the OPEN state.
// - Production WebSocket clients commonly need reconnection, heartbeat, authentication, and resynchronization strategies.
