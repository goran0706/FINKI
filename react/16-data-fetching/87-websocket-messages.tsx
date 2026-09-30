/**
 * WebSocket Messages
 * ==================
 *
 * WebSocket messages are application data frames delivered through an open
 * WebSocket connection. The browser exposes each received message through a
 * `message` event whose `data` property may represent text, a Blob, or an
 * ArrayBuffer depending on the received payload and the WebSocket binary type.
 *
 * Text messages are commonly encoded as JSON when an application needs
 * structured data. JSON parsing converts the network string into an unknown
 * JavaScript value, so runtime validation is required before treating that
 * value as a specific TypeScript interface. TypeScript interfaces describe
 * compile-time expectations but cannot validate untrusted network data.
 *
 * WebSocket messages can also be sent from the client with `send`. The browser
 * accepts string data, ArrayBuffer, typed-array views, Blob values, and other
 * supported binary data types. Sending should occur only while the connection
 * is OPEN. The `bufferedAmount` property reports the number of bytes queued for
 * transmission that have not yet been sent.
 *
 * Message ordering is preserved for frames received over a single WebSocket
 * connection, but application code should still define message semantics such
 * as message types, identifiers, and validation rules. A message can be valid
 * JSON while still having an unexpected application shape.
 *
 * A common misconception is that receiving a WebSocket message automatically
 * updates React state. WebSocket events are external browser events, so the
 * component must explicitly translate incoming data into React state. Another
 * misconception is that a TypeScript type assertion validates a message; it
 * only changes the compile-time interpretation of a value and performs no
 * runtime validation.
 */

import React, { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WebSocketMessagesProps {
  readonly url: string;
}

export interface WebSocketReceivedMessageProps {
  readonly url: string;
}

export interface WebSocketJsonMessageProps {
  readonly url: string;
}

export interface WebSocketSendMessageProps {
  readonly url: string;
  readonly message: string;
}

export interface WebSocketMessageHistoryProps {
  readonly url: string;
}

export interface WebSocketBufferedAmountProps {
  readonly url: string;
  readonly message: string;
}

export interface WebSocketApplicationMessage {
  readonly type: string;
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates receiving a text WebSocket message.
 *
 * The message handler checks the runtime type of `event.data` before storing
 * it as a string because the WebSocket API does not guarantee that every
 * incoming message is textual.
 */
export const WebSocketReceivedMessage: React.FC<WebSocketReceivedMessageProps> = ({
  url,
}: WebSocketReceivedMessageProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Waiting for a text message.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setMessage(event.data);

        return;
      }

      setMessage("Received a non-text WebSocket message.");
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
 * Demonstrates parsing a JSON WebSocket message.
 *
 * JSON.parse returns an unknown application value conceptually, so the
 * component validates the expected fields before storing the value as the
 * application-specific message type.
 */
export const WebSocketJsonMessage: React.FC<WebSocketJsonMessageProps> = ({
  url,
}: WebSocketJsonMessageProps): React.ReactElement => {
  const [applicationMessage, setApplicationMessage] = useState<WebSocketApplicationMessage | null>(null);
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
          setError("The JSON value is not an object.");

          return;
        }

        const candidate: Record<string, unknown> = parsed as Record<string, unknown>;

        if (typeof candidate.type !== "string" || typeof candidate.message !== "string") {
          setError("The message does not contain the expected fields.");

          return;
        }

        setApplicationMessage({
          type: candidate.type,
          message: candidate.message,
        });
        setError("");
      } catch {
        setError("The received message is not valid JSON.");
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
      {applicationMessage === null ? (
        <p>No valid application message received.</p>
      ) : (
        <>
          <p>Type: {applicationMessage.type}</p>
          <p>Message: {applicationMessage.message}</p>
        </>
      )}

      {error.length > 0 && <p role="alert">{error}</p>}
    </section>
  );
};

/**
 * Demonstrates sending a text WebSocket message.
 *
 * The component keeps the socket in a ref because the WebSocket is an
 * imperative external resource. The send operation verifies that the socket
 * exists and is OPEN before calling `send`.
 */
export const WebSocketSendMessage: React.FC<WebSocketSendMessageProps> = ({
  url,
  message,
}: WebSocketSendMessageProps): React.ReactElement => {
  const socketRef = useRef<globalThis.WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    socketRef.current = socket;

    const handleOpen = (): void => {
      setStatus("Connected.");
    };

    const handleClose = (): void => {
      setStatus("Connection closed.");
    };

    const handleError = (): void => {
      setStatus("WebSocket error.");
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
      setStatus("The WebSocket is not open.");

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

/**
 * Demonstrates retaining a bounded history of received messages.
 *
 * Functional state updates are used because multiple WebSocket messages can
 * arrive independently, and each update must build on the latest state.
 */
export const WebSocketMessageHistory: React.FC<WebSocketMessageHistoryProps> = ({
  url,
}: WebSocketMessageHistoryProps): React.ReactElement => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data !== "string") {
        return;
      }

      setMessages((previousMessages: string[]): string[] => [...previousMessages.slice(-9), event.data]);
    };

    socket.addEventListener("message", handleMessage);

    return (): void => {
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, [url]);

  return (
    <section>
      <h3>Recent messages</h3>

      {messages.length === 0 ? (
        <p>No messages received.</p>
      ) : (
        <ol>
          {messages.map((message: string, index: number): React.ReactElement => (
            <li key={`${message}-${index}`}>{message}</li>
          ))}
        </ol>
      )}
    </section>
  );
};

/**
 * Demonstrates the WebSocket bufferedAmount property.
 *
 * bufferedAmount reports the number of bytes of application data that have
 * been queued by `send` but not yet transmitted. It is useful when observing
 * outbound pressure, although it is not an acknowledgement from the server.
 */
export const WebSocketBufferedAmount: React.FC<WebSocketBufferedAmountProps> = ({
  url,
  message,
}: WebSocketBufferedAmountProps): React.ReactElement => {
  const socketRef = useRef<globalThis.WebSocket | null>(null);
  const [bufferedAmount, setBufferedAmount] = useState<number>(0);
  const [status, setStatus] = useState<string>("Connecting...");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    socketRef.current = socket;

    const handleOpen = (): void => {
      setStatus("Connected.");
      setBufferedAmount(socket.bufferedAmount);
    };

    const handleClose = (): void => {
      setStatus("Connection closed.");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);

      socket.close();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [url]);

  const handleSend = (): void => {
    const socket: globalThis.WebSocket | null = socketRef.current;

    if (socket === null || socket.readyState !== globalThis.WebSocket.OPEN) {
      setStatus("The WebSocket is not open.");

      return;
    }

    socket.send(message);

    setBufferedAmount(socket.bufferedAmount);
    setStatus("Message queued for transmission.");
  };

  return (
    <section>
      <p>{status}</p>

      <p>Buffered outbound bytes: {bufferedAmount}</p>

      <button type="button" onClick={handleSend} disabled={message.length === 0}>
        Send and Inspect Buffer
      </button>
    </section>
  );
};

/**
 * Demonstrates tracking the basic message lifecycle of a WebSocket.
 *
 * Incoming messages are counted independently from connection state. This
 * reflects the distinction between transport lifecycle events and application
 * data events.
 */
export const WebSocketMessages: React.FC<WebSocketMessagesProps> = ({
  url,
}: WebSocketMessagesProps): React.ReactElement => {
  const [status, setStatus] = useState<"connecting" | "open" | "closed" | "error">("connecting");
  const [messageCount, setMessageCount] = useState<number>(0);
  const [latestMessage, setLatestMessage] = useState<string>("No message received.");

  useEffect((): (() => void) => {
    const socket: globalThis.WebSocket = new globalThis.WebSocket(url);

    const handleOpen = (): void => {
      setStatus("open");
    };

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data !== "string") {
        setLatestMessage("Received a non-text message.");
      } else {
        setLatestMessage(event.data);
      }

      setMessageCount((previousCount: number): number => previousCount + 1);
    };

    const handleError = (): void => {
      setStatus("error");
    };

    const handleClose = (): void => {
      setStatus("closed");
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
      <p>Connection: {status}</p>

      <p>Messages received: {messageCount}</p>

      <p>Latest message: {latestMessage}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleWebSocketUrl: string = "wss://example.com/socket";

export const WebSocketMessagesDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>WebSocket Messages</h1>

      <h2>1. Receive Text WebSocket Messages</h2>
      <WebSocketReceivedMessage url={exampleWebSocketUrl} />

      <h2>2. Parse and Validate JSON WebSocket Messages</h2>
      <WebSocketJsonMessage url={exampleWebSocketUrl} />

      <h2>3. Send a Text WebSocket Message</h2>
      <WebSocketSendMessage url={exampleWebSocketUrl} message="Hello from the browser." />

      <h2>4. Maintain a Bounded WebSocket Message History</h2>
      <WebSocketMessageHistory url={exampleWebSocketUrl} />

      <h2>5. Observe Buffered Outbound WebSocket Data</h2>
      <WebSocketBufferedAmount url={exampleWebSocketUrl} message="Example outbound message." />

      <h2>6. Track WebSocket Message Activity Separately From Connection State</h2>
      <WebSocketMessages url={exampleWebSocketUrl} />
    </main>
  );
};

export default WebSocketMessagesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - WebSocket messages are delivered through the message event.
// - MessageEvent.data can contain text or binary data, so applications should inspect the runtime representation.
// - JSON.parse does not validate an application's expected message shape.
// - TypeScript interfaces provide compile-time information but do not validate network data at runtime.
// - Messages should be sent only while the WebSocket is OPEN.
// - The WebSocket send method can queue outbound data, and bufferedAmount reports queued bytes that have not yet been transmitted.
// - Functional state updates help preserve messages when multiple WebSocket events update the same state.
// - Message history should be bounded when long-running connections could otherwise accumulate unbounded state.
// - Application message formats should define explicit fields such as message types when structured communication is required.
// - WebSocket message handling is separate from connection lifecycle handling, so applications should model transport state and application data independently.
