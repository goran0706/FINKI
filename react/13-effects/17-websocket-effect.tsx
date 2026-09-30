/**
 * WebSocket Effect
 * ================
 *
 * A WebSocket is an external system whose connection lifetime must be
 * synchronized with the React component. An Effect can create a WebSocket
 * after a render commits, register event listeners for that connection, and
 * return cleanup that removes those listeners and closes the connection.
 *
 * The WebSocket constructor begins a connection attempt immediately. Its
 * `open`, `message`, `error`, and `close` events occur asynchronously, outside
 * React's render cycle. Event handlers therefore form closures over the values
 * from the Effect setup that registered them.
 *
 * A connection dependency belongs in the Effect dependency array. When that
 * dependency changes, React cleans up the previous connection before creating
 * the new one. Cleanup must tolerate connections that are still connecting,
 * already open, or already closed.
 *
 * Calling `close` during the CONNECTING or OPEN states is sufficient to request
 * that the connection stop. Removing the event listeners before closing also
 * prevents obsolete handlers from updating component state after the
 * synchronization has ended.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WebSocketConnectionProps {
  readonly url: string;
}

export interface WebSocketMessageProps {
  readonly url: string;
  readonly initialMessage: string;
}

export interface WebSocketStatusProps {
  readonly url: string;
}

export interface WebSocketChannelProps {
  readonly initialChannel: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const WebSocketConnection: FC<WebSocketConnectionProps> = ({ url }): ReactElement => {
  const [status, setStatus] = useState<string>("Disconnected");

  useEffect((): (() => void) => {
    const socket: WebSocket = new WebSocket(url);

    const handleOpen = (): void => {
      setStatus("Connected");
    };

    const handleClose = (): void => {
      setStatus("Disconnected");
    };

    const handleError = (): void => {
      setStatus("Error");
    };

    setStatus("Connecting");

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);

      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [url]);

  return (
    <section>
      <p>Connection status: {status}</p>
    </section>
  );
};

export const WebSocketMessage: FC<WebSocketMessageProps> = ({ url, initialMessage }): ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);
  const [receivedMessage, setReceivedMessage] = useState<string>("No message received");
  const [connected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect((): (() => void) => {
    const socket: WebSocket = new WebSocket(url);

    socketRef.current = socket;

    const handleOpen = (): void => {
      setConnected(true);
    };

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setReceivedMessage(event.data);
      }
    };

    const handleClose = (): void => {
      setConnected(false);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [url]);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const sendMessage = (): void => {
    const socket: WebSocket | null = socketRef.current;

    if (socket === null || socket.readyState !== WebSocket.OPEN || message.length === 0) {
      return;
    }

    socket.send(message);
    setMessage("");
  };

  return (
    <section>
      <label htmlFor="websocket-message-input">Message</label>

      <input id="websocket-message-input" value={message} onChange={handleMessageChange} />

      <p>Connection: {connected ? "Connected" : "Disconnected"}</p>

      <p>Received: {receivedMessage}</p>

      <button type="button" onClick={sendMessage}>
        Send message
      </button>
    </section>
  );
};

export const WebSocketStatus: FC<WebSocketStatusProps> = ({ url }): ReactElement => {
  const [status, setStatus] = useState<string>("Disconnected");

  useEffect((): (() => void) => {
    const socket: WebSocket = new WebSocket(url);

    const handleOpen = (): void => {
      setStatus("Open");
    };

    const handleError = (): void => {
      setStatus("Error");
    };

    const handleClose = (): void => {
      setStatus("Closed");
    };

    setStatus("Connecting");

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);

      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [url]);

  return (
    <section>
      <p>Socket status: {status}</p>
    </section>
  );
};

export const WebSocketChannel: FC<WebSocketChannelProps> = ({ initialChannel }): ReactElement => {
  const [channel, setChannel] = useState<string>(initialChannel);
  const [status, setStatus] = useState<string>("Disconnected");

  useEffect((): (() => void) => {
    const socketUrl: string = `wss://example.com/socket?channel=${encodeURIComponent(channel)}`;

    const socket: WebSocket = new WebSocket(socketUrl);

    const handleOpen = (): void => {
      setStatus(`Connected to ${channel}`);
    };

    const handleClose = (): void => {
      setStatus("Disconnected");
    };

    const handleError = (): void => {
      setStatus("Error");
    };

    setStatus(`Connecting to ${channel}`);

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return (): void => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);

      if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [channel]);

  const changeChannel = (): void => {
    setChannel((previousChannel: string): string => (previousChannel === "general" ? "updates" : "general"));
  };

  return (
    <section>
      <p>Channel: {channel}</p>
      <p>{status}</p>

      <button type="button" onClick={changeChannel}>
        Change channel
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const WebSocketEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Creating and cleaning up a WebSocket connection</h2>
      <WebSocketConnection url="wss://example.com/socket" />

      <h2>2. Sending and receiving WebSocket messages</h2>
      <WebSocketMessage url="wss://example.com/socket" initialMessage="Hello" />

      <h2>3. Tracking asynchronous WebSocket connection status</h2>
      <WebSocketStatus url="wss://example.com/socket" />

      <h2>4. Replacing the connection when its channel dependency changes</h2>
      <WebSocketChannel initialChannel="general" />
    </main>
  );
};

export default WebSocketEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A WebSocket is an external system whose connection lifecycle can be
//   synchronized with an Effect.
// - The Effect should create the connection and register its event listeners.
// - Cleanup should remove the exact listeners registered by that Effect setup
//   and close the connection when it is still active.
// - WebSocket event callbacks run asynchronously and can update React state
//   from outside the render cycle.
// - Connection inputs such as a URL or channel belong in the Effect dependency
//   array when they determine which connection should be active.
// - Changing a connection dependency causes React to clean up the old
//   connection before establishing the new one.
// - Cleanup must handle both CONNECTING and OPEN WebSocket states because a
//   connection can be cleaned up before its asynchronous opening event occurs.
// - Event listener identity matters: the same callback reference must be used
//   when removing a listener.
// - A ref can hold the current WebSocket instance when an event handler outside
//   the Effect needs to send data through the active connection.
// - WebSocket synchronization must tolerate repeated setup and cleanup because
//   React development behavior can intentionally exercise Effect lifecycles
//   more than once.
