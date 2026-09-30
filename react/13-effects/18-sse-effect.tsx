/**
 * SSE Effect
 * ==========
 *
 * Server-Sent Events (SSE) provide a one-way communication channel in which a
 * server can continuously push events to a browser. The browser uses the
 * `EventSource` API to establish and maintain the connection and receive events
 * asynchronously.
 *
 * An `EventSource` is an external system whose connection lifetime must be
 * synchronized with the React component. An Effect can create the connection
 * after a render commits, register event listeners for incoming events, and
 * return cleanup that removes those listeners and closes the connection.
 *
 * Unlike WebSockets, SSE is unidirectional: the server can send events to the
 * browser, but the browser does not send application messages back through the
 * `EventSource` connection. `EventSource` also provides automatic reconnection
 * when the connection is unexpectedly lost.
 *
 * The EventSource connection and its events exist outside React's render cycle.
 * Event callbacks therefore run asynchronously and can update React state when
 * new server data arrives.
 *
 * When the URL or another connection input changes, React cleans up the previous
 * EventSource before establishing the new connection. Cleanup is important
 * because closing the connection prevents the old external system from
 * remaining active after the component is no longer synchronized with it.
 */

import { type FC, type ReactElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SSEConnectionProps {
  readonly url: string;
}

export interface SSEMessageProps {
  readonly url: string;
}

export interface SSENamedEventProps {
  readonly url: string;
}

export interface SSEChannelProps {
  readonly initialChannel: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SSEConnection: FC<SSEConnectionProps> = ({ url }): ReactElement => {
  const [status, setStatus] = useState<string>("Disconnected");

  useEffect((): (() => void) => {
    const source: EventSource = new EventSource(url);

    const handleOpen = (): void => {
      setStatus("Connected");
    };

    const handleError = (): void => {
      setStatus("Connection error");
    };

    setStatus("Connecting");

    source.addEventListener("open", handleOpen);
    source.addEventListener("error", handleError);

    return (): void => {
      source.removeEventListener("open", handleOpen);
      source.removeEventListener("error", handleError);
      source.close();
    };
  }, [url]);

  return (
    <section>
      <p>Connection status: {status}</p>
    </section>
  );
};

export const SSEMessage: FC<SSEMessageProps> = ({ url }): ReactElement => {
  const [message, setMessage] = useState<string>("No message received");

  useEffect((): (() => void) => {
    const source: EventSource = new EventSource(url);

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setMessage(event.data);
      }
    };

    source.addEventListener("message", handleMessage);

    return (): void => {
      source.removeEventListener("message", handleMessage);
      source.close();
    };
  }, [url]);

  return (
    <section>
      <p>Latest message: {message}</p>
    </section>
  );
};

export const SSENamedEvent: FC<SSENamedEventProps> = ({ url }): ReactElement => {
  const [notification, setNotification] = useState<string>("No notification received");

  useEffect((): (() => void) => {
    const source: EventSource = new EventSource(url);

    const handleNotification = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setNotification(event.data);
      }
    };

    source.addEventListener("notification", handleNotification);

    return (): void => {
      source.removeEventListener("notification", handleNotification);
      source.close();
    };
  }, [url]);

  return (
    <section>
      <p>Notification: {notification}</p>
    </section>
  );
};

export const SSEChannel: FC<SSEChannelProps> = ({ initialChannel }): ReactElement => {
  const [channel, setChannel] = useState<string>(initialChannel);
  const [status, setStatus] = useState<string>("Disconnected");
  const [message, setMessage] = useState<string>("No message received");
  const sourceRef = useRef<EventSource | null>(null);

  useEffect((): (() => void) => {
    const sourceUrl: string = `https://example.com/sse?channel=${encodeURIComponent(channel)}`;
    const source: EventSource = new EventSource(sourceUrl);

    sourceRef.current = source;

    const handleOpen = (): void => {
      setStatus(`Connected to ${channel}`);
    };

    const handleMessage = (event: MessageEvent): void => {
      if (typeof event.data === "string") {
        setMessage(event.data);
      }
    };

    const handleError = (): void => {
      setStatus("Connection error");
    };

    setStatus(`Connecting to ${channel}`);

    source.addEventListener("open", handleOpen);
    source.addEventListener("message", handleMessage);
    source.addEventListener("error", handleError);

    return (): void => {
      source.removeEventListener("open", handleOpen);
      source.removeEventListener("message", handleMessage);
      source.removeEventListener("error", handleError);

      if (sourceRef.current === source) {
        sourceRef.current = null;
      }

      source.close();
    };
  }, [channel]);

  const changeChannel = (): void => {
    setChannel((previousChannel: string): string => (previousChannel === "general" ? "updates" : "general"));
  };

  return (
    <section>
      <p>Channel: {channel}</p>
      <p>Status: {status}</p>
      <p>Latest message: {message}</p>
      <button type="button" onClick={changeChannel}>
        Change channel
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SSEEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Creating and cleaning up an SSE connection</h2>
      <SSEConnection url="https://example.com/sse" />

      <h2>2. Receiving SSE messages</h2>
      <SSEMessage url="https://example.com/sse" />

      <h2>3. Receiving named SSE events</h2>
      <SSENamedEvent url="https://example.com/sse" />

      <h2>4. Replacing the connection when its channel changes</h2>
      <SSEChannel initialChannel="general" />
    </main>
  );
};

export default SSEEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - `EventSource` provides a one-way server-to-browser communication channel.
// - An Effect can create an `EventSource` after the component renders and
//   synchronize its connection lifecycle with the component.
// - SSE events such as `open`, `message`, and `error` occur asynchronously
//   outside React's render cycle.
// - The default `message` event provides received data through `event.data`.
// - SSE also supports named events that can be registered with
//   `addEventListener`.
// - Effect cleanup should remove the exact event listeners registered during
//   setup and call `EventSource.close()`.
// - `EventSource` automatically attempts to reconnect after an unexpected
//   connection loss.
// - Calling `close()` during cleanup prevents the old EventSource connection
//   from remaining active after synchronization has ended.
// - Connection inputs such as a URL or channel belong in the Effect dependency
//   array when they determine which SSE connection should be active.
// - Changing a connection dependency causes React to clean up the previous
//   EventSource before creating the new connection.
// - A ref can hold the current EventSource instance when another event handler
//   needs access to the active connection.
// - SSE is unidirectional, whereas WebSockets support bidirectional
//   communication.
